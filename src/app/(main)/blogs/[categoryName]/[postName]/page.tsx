import Image from "next/image";
import { Button } from "@/components/atoms/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { preparedBlogData as blogs } from "@/data/blogData";

function getPostData(
  categoryName: string,
  postName: string
): DataProps | undefined {
  const category = blogs.find((data) => data.category === categoryName);
  if (!category) return undefined;

  const post = category.posts.find((post) => post.url === postName);
  if (!post) return undefined;

  return post as DataProps;
}

function getAdjacentPosts(categoryName: string, currentPostUrl: string) {
  const category = blogs.find((data) => data.category === categoryName);
  if (!category) return { prev: null, next: null };

  const currentIndex = category.posts.findIndex((post) => post.url === currentPostUrl);
  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex < category.posts.length - 1 ? category.posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? category.posts[currentIndex - 1] : null,
  };
}

type MetadataProps = {
  params: Promise<{ categoryName: string; postName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { categoryName, postName } = await params;
  const data = getPostData(categoryName, postName);

  if (!data) {
    return {
      title: "Blog not found",
    };
  }

  const description = data.text[0]?.replace(/<[^>]*>/g, "") || "";

  return {
    title: data.title + " | WMA",
    description: description,
  };
}

type DataProps = {
  url: string;
  title: string;
  image: {
    src: string;
    position: string;
    alt: string;
  };
  date: string;
  text: string[];
};

const tagStyles = {
  h1: "text-3xl font-bold text-gray-900 mb-4 mt-6",
  h2: "text-2xl font-semibold text-gray-800 mb-3 mt-5",
  h3: "text-xl font-semibold text-gray-700 mb-2 mt-4",
  p: "text-base text-gray-600 leading-relaxed mb-4",
  strong: "font-bold text-gray-900",
  em: "italic text-gray-700",
  ul: "list-disc list-inside mb-4 text-gray-600 pl-4",
  ol: "list-decimal list-inside mb-4 text-gray-600 pl-4",
  li: "mb-2",
  a: "text-wma-teal hover:text-wma-darkTeal underline",
  blockquote: "border-l-4 border-wma-teal pl-4 italic text-gray-600 my-4",
};

export default async function page({
  params,
}: {
  params: Promise<{ categoryName: string; postName: string }>;
}) {
  const { categoryName, postName } = await params;
  const data = getPostData(categoryName, postName);
  const { prev, next } = getAdjacentPosts(categoryName, postName);

  if (!data) {
    notFound();
  }

  const addTailwindClasses = (htmlString: string) => {
    return Object.entries(tagStyles).reduce((acc, [tag, classes]) => {
      const openTagRegex = new RegExp(`<(${tag})(?![^>]*class=)`, "g");
      return acc.replace(openTagRegex, `<$1 class="${classes}"`);
    }, htmlString);
  };

  return (
    <section className="bg-white pb-32">
      <div className="mx-auto max-w-[768px] px-4 pt-4 sm:px-8 lg:px-0">
        <div className="relative flex flex-col gap-4 lg:gap-0">
          <div className="inline-flex size-fit lg:sticky lg:top-[calc(80px+1rem)]">
            <Button
              asChild
              variant="link"
              size="none"
              className="w-fit gap-0 text-sm text-wma-darkTeal lg:absolute lg:right-[calc(100%+2rem)] xl:right-[calc(100%+4rem)]"
            >
              <Link href="/blogs">
                <ChevronLeft /> Go back
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={data.image.src}
                fill
                className={cn("rounded-sm object-cover", data.image.position)}
                alt={data.image.alt}
              />
            </div>
            <div className="inline-flex flex-col gap-4 lg:gap-8">
              <div className="inline-flex flex-col gap-2">
                <p className="text-sm font-semibold text-wma-teal">
                  {data.date}
                </p>
                <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                  {data.title}
                </h1>
              </div>
              <div className="flex flex-col gap-4">
                {data.text.map((textElement, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: addTailwindClasses(textElement),
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="flex justify-between mt-8 border-t border-gray-200 pt-6">
              {prev ? (
                <Button
                  asChild
                  variant="link"
                  size="none"
                  className="flex items-center gap-1 text-wma-darkTeal hover:text-wma-teal"
                >
                  <Link href={`/blogs/${categoryName}/${prev.url}`}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="max-w-[200px] truncate">{prev.title}</span>
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              
              {next ? (
                <Button
                  asChild
                  variant="link"
                  size="none"
                  className="flex items-center gap-1 text-wma-darkTeal hover:text-wma-teal ml-auto"
                >
                  <Link href={`/blogs/${categoryName}/${next.url}`}>
                    <span className="max-w-[200px] truncate">{next.title}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}