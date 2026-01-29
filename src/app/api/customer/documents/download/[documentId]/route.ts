import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getCollection } from '@/lib/mongodb'
import { IDocument } from '@/lib/types'
import { ObjectId } from 'mongodb'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * GET /api/customer/documents/download/:documentId
 * Secure document download endpoint
 * - Verifies user owns the document
 * - Streams from Cloudinary (hides raw URL)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { documentId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!ObjectId.isValid(documentId) || !userId) {
      return NextResponse.json(
        { error: 'Invalid document ID or missing user ID' },
        { status: 400 }
      )
    }

    // Get document from database
    const documentsCollection = await getCollection<IDocument>('documents')
    const document = await documentsCollection.findOne({
      _id: new ObjectId(documentId),
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (document.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to access this document' },
        { status: 403 }
      )
    }

    // In production, you'd verify the user owns this document using Clerk auth
    // For now, we'll allow access if document exists
    
    const extractPublicIdFromUrl = (url: string) => {
      const uploadMarker = '/upload/'
      const uploadIndex = url.indexOf(uploadMarker)
      if (uploadIndex === -1) return ''

      const afterUpload = url.slice(uploadIndex + uploadMarker.length)
      const [pathWithoutQuery] = afterUpload.split('?')
      const parts = pathWithoutQuery.split('/').filter(Boolean)

      if (parts[0]?.startsWith('v') && /^v\d+$/.test(parts[0])) {
        parts.shift()
      }

      const pathWithExtension = parts.join('/')
      const lastDot = pathWithExtension.lastIndexOf('.')
      return lastDot > -1 ? pathWithExtension.slice(0, lastDot) : pathWithExtension
    }

    const publicId = document.publicId || extractPublicIdFromUrl(document.fileUrl)
    if (!publicId) {
      return NextResponse.json(
        { error: 'Document public ID not found' },
        { status: 500 }
      )
    }

    const inferredFromMime = document.mimeType
      ? (document.mimeType.startsWith('image/') || document.mimeType === 'application/pdf'
          ? 'image'
          : 'raw')
      : null

    const inferredFromUrl = document.fileUrl.includes('/raw/upload/')
      ? 'raw'
      : 'image'

    const resourceType = document.resourceType || inferredFromMime || inferredFromUrl

    const deliveryType = document.deliveryType ||
      (document.fileUrl.includes('/authenticated/') || document.accessMode === 'authenticated'
        ? 'authenticated'
        : 'upload')

    const getExtension = (name: string) => {
      const lastDot = name.lastIndexOf('.')
      return lastDot > -1 ? name.slice(lastDot + 1).toLowerCase() : ''
    }

    const extension = document.format || getExtension(document.fileName)
    const fallbackFormat = resourceType === 'image' ? 'jpg' : 'bin'
    const format = extension || (document.mimeType === 'application/pdf' ? 'pdf' : fallbackFormat)

    const downloadUrl = cloudinary.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: deliveryType,
      attachment: true,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    })

    const cloudinaryResponse = await fetch(downloadUrl)
    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary fetch failed:', cloudinaryResponse.status)
      return NextResponse.json(
        { error: 'Failed to retrieve document from storage' },
        { status: 502 }
      )
    }

    const contentType = cloudinaryResponse.headers.get('content-type') || 'application/octet-stream'
    const contentLength = cloudinaryResponse.headers.get('content-length')

    return new NextResponse(cloudinaryResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Document download error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve document' },
      { status: 500 }
    )
  }
}
