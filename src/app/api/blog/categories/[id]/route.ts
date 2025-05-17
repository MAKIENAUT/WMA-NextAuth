// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single post by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE!);
    
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(id)
    });
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// UPDATE a post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE!);
    
    const body = await request.json();
    
    if (body.date && typeof body.date === 'string') {
      body.date = new Date(body.date);
    }
    
    if (body.category) {
      const categoryExists = await db.collection('categories').findOne({ 
        category: body.category 
      });
      
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: 'Category does not exist' },
          { status: 400 }
        );
      }
    }
    
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    const updatedPost = await db.collection('posts').findOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE!);
    
    const result = await db.collection('posts').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Post deleted successfully' }
    );
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}