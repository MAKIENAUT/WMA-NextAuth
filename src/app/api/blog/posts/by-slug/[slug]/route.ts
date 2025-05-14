// app/api/posts/by-slug/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET a post by slug (useful for blog URLs)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const post = await db.collection('posts').findOne({
      slug: params.slug
    });
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}