// app/api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Replace with your actual database name

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Validate slug
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid post slug' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const postsCollection = db.collection('posts');
    
    // Find post by slug
    const post = await postsCollection.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}