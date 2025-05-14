// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

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
    const db = client.db(process.env.MONGODB_DATABASE);
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
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!title || !content || !category || !author || !newSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
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

    // Handle image update
    let imagePath = null;
    const existingPost = await postsCollection.findOne({ slug });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (imageFile) {
      const imageName =
        (formData.get("imageName") as string) || `${newSlug}-${Date.now()}`;
      const imagesDir = join(process.cwd(), "public", "images", "posts");

      // Create the image file path
      const ext = imageFile.name.split(".").pop();
      const safeImageName = `${newSlug}-${imageName.replace(/[^\w-]/g, "")}.${ext}`;
      const imageDest = join(imagesDir, safeImageName);

      // Save the new image
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(imageDest, imageBuffer);

      // Delete old image if it exists
      if (existingPost?.imagePath) {
        try {
          const oldImagePath = join(
            process.cwd(),
            "public",
            existingPost.imagePath
          );
          await unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      imagePath = `/images/posts/${safeImageName}`;
    } else {
      // Keep existing image if no new image is uploaded
      imagePath = existingPost?.imagePath || null;
    }

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
          imagePath,
          updatedAt: new Date(),
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
    const db = client.db(process.env.MONGODB_DATABASE);
    const postsCollection = db.collection("posts");

    // Find post first to get image path
    const post = await postsCollection.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the image if it exists
    if (post.imagePath) {
      try {
        const imagePath = join(process.cwd(), "public", post.imagePath);
        await unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
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
