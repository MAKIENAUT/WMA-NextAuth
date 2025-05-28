// app/(main)/posts/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  slug: string;
  imageUrl: string | null;
  createdAt: string;
  dateAuthored: string;
}

const renderEditorContent = (content: string): JSX.Element => {
  try {
    const contentObj = JSON.parse(content);

    if (!contentObj.blocks || contentObj.blocks.length === 0) {
      return <div></div>;
    }

    return (
      <div className="editor-content">
        {contentObj.blocks.map((block: any, index: number) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                  className="my-4"
                />
              );

            case "header":
              const HeaderTag =
                `h${block.data.level}` as keyof JSX.IntrinsicElements;
              return (
                <HeaderTag
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                  className={`my-4 font-bold ${
                    block.data.level === 1
                      ? "text-3xl"
                      : block.data.level === 2
                        ? "text-2xl"
                        : block.data.level === 3
                          ? "text-xl"
                          : block.data.level === 4
                            ? "text-lg"
                            : block.data.level === 5
                              ? "text-base"
                              : "text-sm"
                  }`}
                />
              );

            case "list":
              const ListTag = block.data.style === "ordered" ? "ol" : "ul";
              const listClass =
                block.data.style === "ordered" ? "list-decimal" : "list-disc";

              return (
                <ListTag key={index} className={`my-4 pl-6 ${listClass}`}>
                  {block.data.items.map((item: any, i: number) => {
                    const itemContent =
                      typeof item === "string" ? item : item.content;
                    return (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: itemContent }}
                        className="mb-1"
                      />
                    );
                  })}
                </ListTag>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-gray-300 pl-4 italic my-6"
                >
                  <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                  {block.data.caption && (
                    <footer className="text-gray-600 text-sm mt-2">
                      — {block.data.caption}
                    </footer>
                  )}
                </blockquote>
              );

            case "image":
              return (
                <figure key={index} className="my-6">
                  <img
                    src={block.data.file?.url}
                    alt={block.data.caption || ""}
                    className="w-full rounded-lg"
                  />
                  {block.data.caption && (
                    <figcaption className="text-center text-gray-600 text-sm mt-2">
                      {block.data.caption}
                    </figcaption>
                  )}
                </figure>
              );

            case "embed":
              return (
                <div key={index} className="embed-container my-6">
                  <iframe
                    src={block.data.embed}
                    title={block.data.caption || "Embedded content"}
                    width="100%"
                    height={block.data.height || 320}
                    frameBorder="0"
                    allowFullScreen
                  />
                  {block.data.caption && (
                    <div className="text-center text-gray-600 text-sm mt-2">
                      {block.data.caption}
                    </div>
                  )}
                </div>
              );

            case "table":
              return (
                <div key={index} className="overflow-x-auto my-6">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      {block.data.content.map(
                        (row: string[], rowIndex: number) => (
                          <tr key={rowIndex}>
                            {row.map((cell: string, cellIndex: number) => (
                              <td
                                key={cellIndex}
                                className="border border-gray-300 p-2"
                                dangerouslySetInnerHTML={{ __html: cell }}
                              />
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              );

            case "delimiter":
              return (
                <hr key={index} className="my-6 border-t-2 border-gray-200" />
              );

            case "code":
              return (
                <pre
                  key={index}
                  className="bg-gray-100 p-4 rounded my-6 overflow-x-auto"
                >
                  <code>{block.data.code}</code>
                </pre>
              );

            case "raw":
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.data.html }}
                  className="my-6"
                />
              );

            default:
              console.log("Unhandled block type:", block.type);
              return (
                <div key={index} className="my-4 text-gray-500">
                  [{block.type} content]
                </div>
              );
          }
        })}
      </div>
    );
  } catch (e) {
    console.error("Error rendering content:", e);
    return <div className="text-red-500">Error rendering content</div>;
  }
};

const RecommendedPostCard = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="block mb-5 hover:bg-blue-50 transition-colors rounded-lg p-2"
    >
      <div className="flex items-start space-x-4">
        {post.imageUrl ? (
          <div className="relative w-24 h-[54px] flex-shrink-0">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="96px"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        ) : (
          <div className="w-24 h-[54px] bg-gray-200 rounded-md flex-shrink-0"></div>
        )}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-base line-clamp-2 mb-1 text-gray-800">
            {post.title}
          </h3>
          <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
            {post.category}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch post");
        }

        setPost(data.post);

        if (data.post) {
          fetchRecommendedPosts(data.post);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedPosts = async (currentPost: Post) => {
      try {
        const response = await fetch(
          `/api/posts/recommended?category=${currentPost.category}&currentSlug=${currentPost.slug}`
        );
        const data = await response.json();

        if (response.ok) {
          setRecommendedPosts(data.posts);
        }
      } catch (err) {
        console.error("Error fetching recommended posts:", err);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/blogs" className="text-blue-600 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-10 text-gray-500">Post not found</div>
        <div className="mt-4 text-center">
          <Link href="/blogs" className="text-blue-600 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6">
        <Link
          href="/blogs"
          className="text-blue-600 hover:underline inline-flex items-center"
        >
          <span className="mr-1">←</span> Back to all posts
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="bg-white shadow-md rounded-lg overflow-hidden lg:flex-grow">
          {post.imageUrl && (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                style={{ objectFit: "cover" }}
                className="w-full"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <header className="mb-8">
              <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="text-gray-600">
                By <span className="font-medium">{post.author}</span> •{" "}
                {new Date(post.dateAuthored).toLocaleDateString("en-US", {
                  // Changed from post.createdAt
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </header>

            <div className="prose max-w-none">
              {renderEditorContent(post.content)}
            </div>
          </div>
        </article>

        {/* Recommended Posts Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-28">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-3">
                Recommended Posts
              </h2>

              {recommendedPosts.length > 0 ? (
                <div className="space-y-4">
                  {recommendedPosts.map((recPost) => (
                    <RecommendedPostCard key={recPost._id} post={recPost} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No recommended posts available
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
