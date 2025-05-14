// app/(main)/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  createdAt: string;
  imagePath?: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
          setPosts(posts.filter((post) => post.slug !== slug));
        } else {
          setError(data.error || "Failed to delete post");
        }
      } catch (err) {
        setError("Failed to delete post");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/dashboard/create-post"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p>No posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Title</th>
                <th className="py-3 px-4 border-b text-left">Category</th>
                <th className="py-3 px-4 border-b text-left">Author</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <Link
                      href={`/dashboard/posts/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-b">{post.category}</td>
                  <td className="py-3 px-4 border-b">{post.author}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <Link
                      href={`/dashboard/edit-post/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}