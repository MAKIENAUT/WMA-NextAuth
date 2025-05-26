// app/(main)/posts/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/ui/button";

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  slug: string;
  imagePath: string | null;
  createdAt: string;
}

// Main navigation categories (similar to the WMA Blogs tabs)
const navCategories = ["All", "Updates", "News", "Posts"];

// List of all possible post categories
const categories = [
  "All",
  "Technology",
  "Programming",
  "Design",
  "Business",
  "Lifestyle",
  "Other",
];

// Helper function to extract text excerpt from EditorJS content
const getEditorJSExcerpt = (
  content: string,
  maxLength: number = 150
): string => {
  try {
    // Check if content is valid JSON before trying to parse
    if (!content || typeof content !== "string") {
      return "";
    }

    // If content starts with HTML tags rather than JSON structure, handle as plain text
    if (content.trim().startsWith("<") || !content.includes('"blocks":')) {
      // Strip HTML tags from plain text content
      const plainText = content.replace(/<[^>]*>/g, "");
      return plainText.length <= maxLength
        ? plainText
        : plainText.substring(0, maxLength) + "...";
    }

    // Try to parse as JSON
    const contentObj = JSON.parse(content);

    // If there are no blocks, return empty string
    if (!contentObj.blocks || !Array.isArray(contentObj.blocks)) {
      return "";
    }

    // Extract text from blocks
    const textBlocks = contentObj.blocks.map((block: any) => {
      // Return the text content based on block type
      switch (block.type) {
        case "paragraph":
          return block.data.text;
        case "header":
          return block.data.text;
        case "list":
          if (Array.isArray(block.data.items)) {
            return block.data.items
              .map((item: any) =>
                typeof item === "string" ? item : item.content || ""
              )
              .join(" ");
          }
          return "";
        case "quote":
          return block.data.text;
        default:
          return "";
      }
    });

    // Join all text blocks into a single string
    const fullText = textBlocks.join(" ");

    // Strip HTML tags
    const plainText = fullText.replace(/<[^>]*>/g, "");

    // Truncate if needed
    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength) + "...";
  } catch (e) {
    console.error(
      "Error parsing content:",
      e,
      "Content:",
      content?.substring(0, 100) + "..."
    );
    // For non-JSON content, try to extract plain text
    if (typeof content === "string") {
      // Strip HTML tags
      const plainText = content.replace(/<[^>]*>/g, "");
      return plainText.length <= maxLength
        ? plainText
        : plainText.substring(0, maxLength) + "...";
    }
    return "";
  }
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNavCategory, setSelectedNavCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_PAGE = 6;

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch posts");
        }

        setPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts whenever category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.category === selectedCategory)
      );
    }
    // Reset pagination when filter changes
    setPage(1);
    setHasMore(true);
  }, [selectedCategory, posts]);

  // Filter posts by navigation category
  useEffect(() => {
    let filtered = [...posts];

    if (selectedNavCategory === "Updates") {
      filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes("update") ||
          post.category.toLowerCase().includes("update")
      );
    } else if (selectedNavCategory === "News") {
      filtered = posts.filter((post) =>
        post.category.toLowerCase().includes("news")
      );
    } else if (selectedNavCategory !== "All") {
      // Any other categories specific filtering
      filtered = posts.filter((post) => post.category === selectedNavCategory);
    }

    setFilteredPosts(filtered);
    // Reset pagination when navigation category changes
    setPage(1);
    setHasMore(true);
  }, [selectedNavCategory, posts]);

  // Update displayed posts whenever filteredPosts or page changes
  useEffect(() => {
    const endIndex = page * POSTS_PER_PAGE;
    const postsToDisplay = filteredPosts.slice(0, endIndex);
    setDisplayedPosts(postsToDisplay);

    // Check if we've reached the end of available posts
    setHasMore(endIndex < filteredPosts.length);
  }, [filteredPosts, page]);

  const loadMorePosts = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      setLoadingMore(false);
    }, 300);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNavCategoryChange = (category: string) => {
    setSelectedNavCategory(category);
    setSelectedCategory("All"); // Reset subcategory filter when changing main category
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()].substring(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (loading) {
    return <div className="text-center py-10 bg-white">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 bg-white">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen">
      {/* Header with large title */}
      <div className="border-b border-wma-darkTeal">
        <h1 className="mx-auto max-w-[1280px] px-4 py-6 text-4xl font-bold sm:py-10 sm:text-5xl md:px-8 md:py-14 md:text-6xl lg:py-20 lg:text-7xl xl:px-20 xl:text-8xl">
          WMA Blogs
        </h1>
      </div>

      {/* Navigation tabs - updated to match carousel dots styling */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-8">
        <div className="border-b border-black">
          <div className="flex">
            {navCategories.map((category) => (
              <Button
                key={category}
                onClick={() => handleNavCategoryChange(category)}
                variant={"carousel"}
                className={cn(
                  "py-2 px-4 font-medium text-base relative transition-colors duration-200",
                  "hover:text-wma-darkTeal focus:outline-none",
                  selectedNavCategory === category
                    ? "border-wma-darkTeal text-wma-darkTeal border-b-2"
                    : "text-gray-500"
                )}
              >
                {category}
                <span className="sr-only">{category}</span>
              </Button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {posts.length === 0
              ? "No posts found."
              : `No posts found in the "${selectedNavCategory}" category.`}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
              {displayedPosts.map((post, index) => {
                // Check if this is the last post and we should attach a ref
                const isLastPost = index === displayedPosts.length - 1;

                return (
                  <div
                    ref={isLastPost ? lastPostElementRef : null}
                    key={post._id}
                    className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white h-full"
                  >
                    {/* Make the entire card clickable */}
                    <Link
                      href={`/posts/${post.slug}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Read post: ${post.title}`}
                    >
                      <span className="sr-only">Read post: {post.title}</span>
                    </Link>

                    {/* Card Image as Background with proportional height */}
                    <div
                      className="w-full h-60 relative"
                      style={{
                        backgroundImage: post.imagePath
                          ? `url(${post.imagePath})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: post.imagePath
                          ? "transparent"
                          : "#f3f4f6",
                      }}
                    >
                      {!post.imagePath && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Date */}
                      <div className="text-gray-600 text-sm mb-2">
                        {formatDate(post.createdAt)}
                      </div>

                      {/* Title - limit to 2 lines */}
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 relative z-20">
                        {post.title}
                      </h2>

                      {/* Description - limit to 3 lines */}
                      <div className="text-gray-700 line-clamp-3 mb-4">
                        <p>{getEditorJSExcerpt(post.content, 180)}</p>
                      </div>

                      {/* Label - small notification */}
                      {post.category === "Critical Update" && (
                        <div className="mt-1 mb-2">
                          <span className="text-gray-600 text-sm">
                            Critical Update: New USCIS Form Edition
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer with Read More link - centered and styled */}
                    <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50 text-center relative z-20 pointer-events-none">
                      <span className="font-semibold text-wma-teal inline-flex items-center justify-center">
                        Read more
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loading indicator at the bottom */}
            {loadingMore && (
              <div className="text-center py-6">
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-wma-teal border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}

            {/* No more posts indicator */}
            {!hasMore && displayedPosts.length > 0 && (
              <div className="text-center py-6 text-gray-500">
                No more posts to load
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
