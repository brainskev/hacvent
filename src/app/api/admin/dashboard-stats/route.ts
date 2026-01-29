import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const customers = await getCollection('customers')
    const contractors = await getCollection('contractors')
    const projects = await getCollection('projects')
    const payments = await getCollection('payments')

    // Count customers by status
    const newCustomers = await customers.countDocuments({ status: 'new' })
    const matchedCustomers = await customers.countDocuments({ status: 'matched' })

    // Count projects by status
    const pendingProjects = await projects.countDocuments({ status: 'pending' })
    const submittedProjects = await projects.countDocuments({ status: 'submitted' })
    const approvedProjects = await projects.countDocuments({ status: 'approved' })

    // Count pending contractor approvals
    const pendingContractorApprovals = await contractors.countDocuments({ 
      approved: false, 
      status: 'pending' 
    })

    // Calculate pending payments
    const pendingPaymentsResult = await payments.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    const pendingPayments = pendingPaymentsResult[0]?.total || 0

    // Calculate total revenue from approved projects
    const revenueResult = await projects.aggregate([
      { $match: { status: 'approved' } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: { $add: ['$referral_fee', '$filing_fee'] } } 
        } 
      }
    ]).toArray()
    const totalRevenue = revenueResult[0]?.total || 0

    return NextResponse.json({
      newCustomers,
      matchedCustomers,
      pendingProjects,
      submittedProjects,
      approvedProjects,
      pendingContractorApprovals,
      pendingPayments,
      totalRevenue,
    }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
