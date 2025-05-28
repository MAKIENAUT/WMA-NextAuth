// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { put, del } from '@vercel/blob';
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const postsCollection = db.collection("posts");

    const post = await postsCollection.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formData = await req.formData();

    // Extract fields
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const author = formData.get("author") as string;
    const newSlug = formData.get("slug") as string;
    const dateAuthored = formData.get("dateAuthored") as string;
    const imageFile = formData.get("image") as File | null;
    const imageName = formData.get("imageName") as string | null;

    // Validate required fields
    if (!title || !content || !category || !author || !newSlug || !dateAuthored) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const postsCollection = db.collection("posts");

    // Check if new slug is already taken by another post
    if (newSlug !== slug) {
      const existingPost = await postsCollection.findOne({ slug: newSlug });
      if (existingPost) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Get existing post
    const existingPost = await postsCollection.findOne({ slug });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Handle image update
    let imageUrl = existingPost.imageUrl || null;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_goE3wUXUUNM5VqBG_3SSvSyc3JwZw6wl5VWKPfDwT7ByqZy';

    if (imageFile && imageFile.size > 0 && imageName) {
      // Delete the previous image if it exists
      if (existingPost.imageUrl) {
        try {
          await del(existingPost.imageUrl, { token: blobToken });
          console.log('Previous image deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting previous image:', deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const safeFileName = `${newSlug}-${Date.now()}.${fileExt}`;
      
      try {
        const blob = await put(safeFileName, imageFile, {
          access: 'public',
          token: blobToken
        });
        
        imageUrl = blob.url;
      } catch (blobError) {
        console.error('Error uploading to blob storage:', blobError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Convert dateAuthored string to Date object
    const authoredDate = new Date(dateAuthored);

    // Update the post
    const updatedPostResult = await postsCollection.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          content,
          category,
          author,
          slug: newSlug,
          dateAuthored: authoredDate, // User-specified authored date
          imageUrl,
          updatedAt: new Date(), // Automatic update timestamp
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedPostResult) {
      return NextResponse.json(
        { error: "Post not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        post: updatedPostResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'Production-DB');
    const postsCollection = db.collection("posts");

    // Find post first to get image info
    const post = await postsCollection.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the image from Vercel Blob storage if it exists
    if (post.imageUrl) {
      try {
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_goE3wUXUUNM5VqBG_3SSvSyc3JwZw6wl5VWKPfDwT7ByqZy';
        await del(post.imageUrl, { token: blobToken });
        console.log('Image deleted from blob storage successfully');
      } catch (deleteError) {
        console.error('Error deleting image from blob storage:', deleteError);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post
    await postsCollection.deleteOne({ slug });

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}