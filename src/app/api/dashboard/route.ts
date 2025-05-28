// app/api/dashboard/route.ts
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
    
    // Get current date for filtering recent activity
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all collections
    const postsCollection = db.collection('posts');
    const j1ApplicationsCollection = db.collection('j1_applications');

    // Execute all queries in parallel for better performance
    const [
      totalPosts,
      recentPosts,
      totalApplications,
      pendingApplications,
      recentApplications,
      postsByCategory,
      applicationsByStatus,
      recentActivity
    ] = await Promise.all([
      // Posts stats
      postsCollection.countDocuments(),
      postsCollection.countDocuments({ 
        createdAt: { $gte: sevenDaysAgo } 
      }),
      
      // Applications stats
      j1ApplicationsCollection.countDocuments(),
      j1ApplicationsCollection.countDocuments({ 
        status: { $in: ['new', 'pending'] } 
      }),
      j1ApplicationsCollection.countDocuments({ 
        createdAt: { $gte: sevenDaysAgo } 
      }),

      // Category breakdown
      postsCollection.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray(),

      // Application status breakdown
      j1ApplicationsCollection.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray(),

      // Recent activity (posts and applications from last 7 days)
      Promise.all([
        postsCollection.find(
          { createdAt: { $gte: sevenDaysAgo } },
          { 
            projection: { 
              title: 1, 
              author: 1, 
              createdAt: 1, 
              category: 1,
              slug: 1 
            } 
          }
        ).sort({ createdAt: -1 }).limit(5).toArray(),
        
        j1ApplicationsCollection.find(
          { createdAt: { $gte: sevenDaysAgo } },
          { 
            projection: { 
              first_name: 1, 
              last_name: 1, 
              createdAt: 1, 
              status: 1,
              applicationId: 1,
              email_address: 1
            } 
          }
        ).sort({ createdAt: -1 }).limit(5).toArray()
      ])
    ]);

    // Process recent activity
    const [recentPostsActivity, recentApplicationsActivity] = recentActivity;
    
    // Combine and sort recent activity
    const combinedActivity = [
      ...recentPostsActivity.map(post => ({
        type: 'post',
        id: post._id,
        title: post.title,
        description: `New post by ${post.author}`,
        createdAt: post.createdAt,
        category: post.category,
        slug: post.slug,
        link: `/blogs/${post.slug}`
      })),
      ...recentApplicationsActivity.map(app => ({
        type: 'application',
        id: app._id,
        title: `${app.first_name} ${app.last_name}`,
        description: `New J1 visa application (${app.status})`,
        createdAt: app.createdAt,
        status: app.status,
        applicationId: app.applicationId,
        email: app.email_address,
        link: `/dashboard/forms/${app._id}`
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 10); // Get top 10 most recent activities

    // Calculate growth rates (comparing last 30 days to previous 30 days)
    const [
      postsLastMonth,
      postsPreviousMonth,
      applicationsLastMonth,
      applicationsPreviousMonth
    ] = await Promise.all([
      postsCollection.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
      postsCollection.countDocuments({ 
        createdAt: { 
          $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          $lt: thirtyDaysAgo 
        } 
      }),
      j1ApplicationsCollection.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
      j1ApplicationsCollection.countDocuments({ 
        createdAt: { 
          $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          $lt: thirtyDaysAgo 
        } 
      })
    ]);

    // Calculate growth percentages
    const postsGrowth = postsPreviousMonth > 0 
      ? ((postsLastMonth - postsPreviousMonth) / postsPreviousMonth * 100).toFixed(1)
      : postsLastMonth > 0 ? '100' : '0';
    
    const applicationsGrowth = applicationsPreviousMonth > 0
      ? ((applicationsLastMonth - applicationsPreviousMonth) / applicationsPreviousMonth * 100).toFixed(1)
      : applicationsLastMonth > 0 ? '100' : '0';

    // Build comprehensive dashboard data
    const dashboardData = {
      stats: {
        totalPosts,
        totalApplications,
        pendingApplications,
        recentActivity: combinedActivity.length,
        recentPosts,
        recentApplications
      },
      growth: {
        posts: {
          current: postsLastMonth,
          previous: postsPreviousMonth,
          percentage: postsGrowth,
          trend: parseFloat(postsGrowth) >= 0 ? 'up' : 'down'
        },
        applications: {
          current: applicationsLastMonth,
          previous: applicationsPreviousMonth,
          percentage: applicationsGrowth,
          trend: parseFloat(applicationsGrowth) >= 0 ? 'up' : 'down'
        }
      },
      breakdown: {
        postsByCategory: postsByCategory.map(item => ({
          category: item._id || 'Uncategorized',
          count: item.count
        })),
        applicationsByStatus: applicationsByStatus.map(item => ({
          status: item._id || 'unknown',
          count: item.count
        }))
      },
      recentActivity: combinedActivity,
      summary: {
        totalContent: totalPosts,
        totalSubmissions: totalApplications,
        pendingReview: pendingApplications,
        weeklyActivity: recentPosts + recentApplications
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    }, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
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