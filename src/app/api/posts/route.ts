// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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
    const dateAuthored = formData.get('dateAuthored') as string;
    const imageFile = formData.get('image') as File | null;
    const imageName = formData.get('imageName') as string | null;

    let imageUrl = null;

    // Process image upload if exists
    if (imageFile && imageFile.size > 0 && imageName) {
      const fileExt = imageFile.name.split('.').pop();
      const safeFileName = `${slug}-${Date.now()}.${fileExt}`;

      // Get token from environment variable or use fallback
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_goE3wUXUUNM5VqBG_3SSvSyc3JwZw6wl5VWKPfDwT7ByqZy';

      // Debug logging
      console.log('Environment token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
      console.log('Using token (first 20 chars):', blobToken.substring(0, 20) + '...');

      const blob = await put(safeFileName, imageFile, {
        access: 'public',
        token: blobToken
      });

      imageUrl = blob.url;
    }

    // Convert dateAuthored string to Date object
    const authoredDate = new Date(dateAuthored);

    // Prepare post data
    const postData = {
      title,
      content,
      category,
      author,
      slug,
      imageUrl,
      dateAuthored: authoredDate, // User-specified authored date
      createdAt: new Date(),      // Automatic creation timestamp
      updatedAt: new Date()       // Automatic update timestamp
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