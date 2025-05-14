// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  try {
    // Convert id to string if it's an array
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const category = await db.collection('categories').findOne({
      _id: new ObjectId(id)
    });
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// UPDATE a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  try {
    // Convert id to string if it's an array
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const body = await request.json();
    
    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    const updatedCategory = await db.collection('categories').findOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  try {
    // Convert id to string if it's an array
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    
    const result = await db.collection('categories').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Category deleted successfully' }
    );
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}