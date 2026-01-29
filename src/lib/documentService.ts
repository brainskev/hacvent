import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/mongodb'
import { IDocument } from '@/lib/types'

/**
 * Get all documents for an application
 */
export async function getApplicationDocuments(applicationId: string): Promise<IDocument[]> {
  const collection = await getCollection<IDocument>('documents')
  return collection
    .find({ applicationId: new ObjectId(applicationId) })
    .sort({ uploadedAt: -1 })
    .toArray()
}

/**
 * Get all documents for an application owned by a specific user
 */
export async function getApplicationDocumentsForUser(
  applicationId: string,
  userId: string
): Promise<IDocument[]> {
  const collection = await getCollection<IDocument>('documents')
  const userFilter = ObjectId.isValid(userId)
    ? { $or: [{ userId: new ObjectId(userId) }, { userId }] }
    : { userId }

  return collection
    .find({
      applicationId: new ObjectId(applicationId),
      ...userFilter,
    })
    .sort({ uploadedAt: -1 })
    .toArray()
}

/**
 * Get a single document
 */
export async function getDocument(documentId: string): Promise<IDocument | null> {
  const collection = await getCollection<IDocument>('documents')
  return collection.findOne({ _id: new ObjectId(documentId) })
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  const collection = await getCollection<IDocument>('documents')
  const result = await collection.deleteOne({ _id: new ObjectId(documentId) })
  return result.deletedCount > 0
}

/**
 * Update document status (used by admin for verification/rejection)
 */
export async function updateDocumentStatus(
  documentId: string,
  status: 'verified' | 'rejected',
  verifiedBy?: ObjectId,
  rejectionReason?: string
): Promise<IDocument | null> {
  const collection = await getCollection<IDocument>('documents')

  const updateData: any = {
    status,
    ...(status === 'verified' && {
      verifiedAt: new Date(),
      verifiedBy,
    }),
    ...(status === 'rejected' && {
      rejectionReason,
    }),
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(documentId) },
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) return null
  
  return result as IDocument
}
