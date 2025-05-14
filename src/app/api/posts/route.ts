// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Replace with your actual database name
const DATABASE_NAME = "Production-DB";

export async function POST(req: Request) {
  try {
    // Handle form data instead of JSON
    const formData = await req.formData();
    
    // Extract text fields
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const slug = formData.get('slug') as string;
    
    // Validate required fields
    if (!title || !content || !category || !author || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug is unique
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const postsCollection = db.collection('posts');
    
    const existingPost = await postsCollection.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Handle image upload
    let imagePath = null;
    const imageFile = formData.get('image') as File;
    
    if (imageFile) {
      const imageName = formData.get('imageName') as string || `${slug}-${uuidv4()}`;
      
      // Ensure public/images directory exists
      const imagesDir = join(process.cwd(), 'public', 'images', 'posts');
      try {
        await mkdir(imagesDir, { recursive: true });
      } catch (err) {
        console.log('Directory already exists or could not be created');
      }
      
      // Create the image file path
      const ext = imageFile.name.split('.').pop();
      const safeImageName = `${slug}-${imageName.replace(/[^\w-]/g, '')}.${ext}`;
      const imageDest = join(imagesDir, safeImageName);
      
      // Save the image
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(imageDest, imageBuffer);
      
      // Store the relative path to be used in <Image> components
      imagePath = `/images/posts/${safeImageName}`;
    }
    
    // Create new post
    const newPost = await postsCollection.insertOne({
      title,
      content,
      category,
      author,
      slug,
      imagePath,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      post: {
        _id: newPost.insertedId,
        title,
        content,
        category,
        author,
        slug,
        imagePath,
        createdAt: new Date()
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);  // This will use the database specified in the MongoDB URI
    const postsCollection = db.collection('posts');
    
    // Get all posts, sorted by creation date (newest first)
    const posts = await postsCollection.find().sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}