// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Process post data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const slug = formData.get('slug') as string;
    const imageFile = formData.get('image') as File | null;
    const imageName = formData.get('imageName') as string | null;

    let imagePath = null;

    // Process image upload if exists
    if (imageFile && imageFile.size > 0 && imageName) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'posts');
      await mkdir(uploadDir, { recursive: true });
      
      const fileExt = imageFile.name.split('.').pop();
      const safeFileName = `${slug}-${Date.now()}.${fileExt}`;
      const filePath = join(uploadDir, safeFileName);
      
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(filePath, buffer);
      
      imagePath = `/uploads/posts/${safeFileName}`;
    }

    // Prepare post data
    const postData = {
      title,
      content,
      category,
      author,
      slug,
      imagePath,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const collection = db.collection('posts');
    
    const result = await collection.insertOne(postData);

    return NextResponse.json({
      success: true,
      post: {
        postId: result.insertedId.toString(),
        ...postData
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const postsCollection = db.collection('posts');
    
    const posts = await postsCollection.find().sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ posts }, { status: 200, headers });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, headers }
    );
  }
}