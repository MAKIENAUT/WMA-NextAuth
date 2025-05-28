// app/api/forms/j1-visa-application/count/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const j1ApplicationsCollection = db.collection('j1_applications');

    // Get total count
    const totalCount = await j1ApplicationsCollection.countDocuments();

    // Get pending applications count
    const pendingCount = await j1ApplicationsCollection.countDocuments({
      status: { $in: ['new', 'pending'] }
    });

    // Get count by different statuses
    const statusCounts = await j1ApplicationsCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get recent applications count (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await j1ApplicationsCollection.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Convert status counts to object for easier access
    const statusBreakdown = statusCounts.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      totalCount,
      pendingCount,
      recentCount,
      statusBreakdown,
      timestamp: new Date().toISOString()
    }, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Error fetching J1 applications count:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch applications count',
        totalCount: 0,
        pendingCount: 0
      },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}