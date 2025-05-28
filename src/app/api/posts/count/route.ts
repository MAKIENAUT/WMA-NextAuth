// app/api/posts/count/route.ts
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
    const postsCollection = db.collection('posts');

    // Get total count
    const totalCount = await postsCollection.countDocuments();

    // Get count by status/category if needed
    const activeCount = await postsCollection.countDocuments({ 
      // Add any filter for active posts if you have a status field
    });

    // Get recent posts count (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await postsCollection.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return NextResponse.json({
      success: true,
      count: totalCount,
      activeCount,
      recentCount,
      timestamp: new Date().toISOString()
    }, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Error fetching posts count:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch posts count',
        count: 0
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