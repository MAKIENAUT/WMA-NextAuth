// app/api/categories/route.ts
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';


// GET all categories
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const categories = await db.collection('categories').find({}).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const body = await request.json();
    
    const result = await db.collection('categories').insertOne(body);
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        _id: result.insertedId,
        ...body 
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}