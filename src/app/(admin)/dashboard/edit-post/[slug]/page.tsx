// app/(main)/edit-post/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const EditorComponent = dynamic(
  () => import("../../../../../components/EditorComponent"),
  { ssr: false }
);

const categories = ["Updates", "News", "Posts"];

const MAX_TITLE_LENGTH = 100;
const MAX_SLUG_LENGTH = 50;

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Properly use the params with React.use()
  const { slug } = use(params);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Updates",
    author: "",
    slug: "",
    dateAuthored: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentImagePath, setCurrentImagePath] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch post");
        }

        const post = data.post;
        
        // Format dateAuthored for the date input (YYYY-MM-DD)
        let formattedDate = new Date().toISOString().split('T')[0];
        if (post.dateAuthored) {
          const authoredDate = new Date(post.dateAuthored);
          formattedDate = authoredDate.toISOString().split('T')[0];
        }

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          author: post.author,
          slug: post.slug,
          dateAuthored: formattedDate,
        });

        if (post.imagePath || post.imageUrl) {
          const imageUrl = post.imageUrl || post.imagePath;
          setCurrentImagePath(imageUrl);
          setImagePreview(imageUrl);
          const fileName = imageUrl.split("/").pop()?.split(".")[0] || "";
          setImageName(fileName);
        }
      } catch (err: any) {
        setError(err.message);
        router.push("/dashboard/posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, router]);

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      const limitedTitle = value.slice(0, MAX_TITLE_LENGTH);
      const generatedSlug = limitedTitle
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
        .slice(0, MAX_SLUG_LENGTH);
      setFormData((prev) => ({
        ...prev,
        [name]: limitedTitle,
        slug: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      const fileName = file.name.split(".")[0];
      setImageName(fileName);
    }
  };

  const handleImageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageName("");
    setCurrentImagePath("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const postFormData = new FormData();
      const finalFormData = {
        ...formData,
      };

      Object.entries(finalFormData).forEach(([key, value]) => {
        postFormData.append(key, value);
      });

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const safeImageName = `${formData.slug}-${imageName.replace(/[^\w]/g, "-")}.${fileExt}`;
        postFormData.append("image", imageFile);
        postFormData.append("imageName", safeImageName);
      } else if (!currentImagePath) {
        postFormData.append("image", "");
      }

      const response = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        body: postFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center py-8">Loading post data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <Link href="/dashboard/posts" className="text-blue-600 hover:underline">
          Back to Posts
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title (Max {MAX_TITLE_LENGTH} characters)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={MAX_TITLE_LENGTH}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/{MAX_TITLE_LENGTH} characters
          </p>
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL Slug (Max {MAX_SLUG_LENGTH} characters)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            maxLength={MAX_SLUG_LENGTH}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This will be used for the post URL: /posts/{formData.slug}
            <br />
            {formData.slug.length}/{MAX_SLUG_LENGTH} characters
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="dateAuthored"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date Authored
          </label>
          <input
            type="date"
            id="dateAuthored"
            name="dateAuthored"
            value={formData.dateAuthored}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the date when the post was originally written/authored
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div className="mt-1 flex flex-col space-y-4">
            {imagePreview ? (
              <div className="relative">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload image
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {(imagePreview || currentImagePath) && (
          <div>
            <label
              htmlFor="imageName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image Name
            </label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={handleImageNameChange}
              placeholder="Enter image name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be used to name the image file in the public folder.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <EditorComponent
            initialContent={formData.content}
            onChange={handleEditorChange}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
          <Link
            href="/dashboard/posts"
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}