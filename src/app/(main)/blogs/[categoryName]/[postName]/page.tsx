import Image from "next/image";
import { Button } from "@/app/components/atoms/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { preparedBlogData as blogs } from "@/app/data/blogData";

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

  // Extract first paragraph text by removing HTML tags
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

// Mapping of HTML tags to Tailwind classes
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

  if (!data) {
    notFound();
  }

  // Function to add Tailwind classes to HTML tags
  const addTailwindClasses = (htmlString: string) => {
    // Use a simple regex to add classes to known tags
    return Object.entries(tagStyles).reduce((acc, [tag, classes]) => {
      // Match opening tags and add classes
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
          </div>
        </div>
      </div>
    </section>
  );
}
