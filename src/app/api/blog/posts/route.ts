// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET all posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }
    
    // Execute query with pagination
    const posts = await db.collection('posts')
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await db.collection('posts').countDocuments(query);
    
    return NextResponse.json({ 
      success: true, 
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// Create a new post
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const body = await request.json();
    
    // Ensure date is a Date object
    if (body.date && typeof body.date === 'string') {
      body.date = new Date(body.date);
    } else if (!body.date) {
      body.date = new Date();
    }
    
    // Validate that the category exists
    const categoryExists = await db.collection('categories').findOne({ 
      category: body.category 
    });
    
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'Category does not exist' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('posts').insertOne(body);
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        _id: result.insertedId,
        ...body 
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
}