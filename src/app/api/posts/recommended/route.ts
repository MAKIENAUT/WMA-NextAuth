// app/api/posts/recommended/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    // Parse URL to get search parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const currentSlug = url.searchParams.get('currentSlug');
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const postsCollection = db.collection('posts');
    
    // Build the query
    const query: any = {};
    
    // If category is provided, find posts in the same category
    if (category) {
      query.category = category;
    }
    
    // Exclude the current post
    if (currentSlug) {
      query.slug = { $ne: currentSlug };
    }
    
    // Find related posts
    // First try to find posts in the same category
    let recommendedPosts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    // If we don't have 3 posts, get more from other categories to fill up
    if (recommendedPosts.length < 3 && currentSlug) {
      const remainingCount = 3 - recommendedPosts.length;
      
      const additionalPosts = await postsCollection
        .find({ slug: { $ne: currentSlug } })
        .sort({ createdAt: -1 })
        .limit(remainingCount)
        .toArray();
      
      // Filter out any duplicates that might exist
      const existingSlugs = new Set(recommendedPosts.map(post => post.slug));
      const uniqueAdditionalPosts = additionalPosts.filter(post => !existingSlugs.has(post.slug));
      
      recommendedPosts = [...recommendedPosts, ...uniqueAdditionalPosts];
    }
    
    return NextResponse.json({ posts: recommendedPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recommended posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended posts' },
      { status: 500 }
    );
  }
}