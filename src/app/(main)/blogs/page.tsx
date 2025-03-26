import { Metadata } from "next";
// import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  BlogsCarouselDots,
  CarouselItem,
} from "@/app/components/organisms/carousel";
import { preparedBlogData } from "@/data/blogData";
import { NewsCard } from "@/app/components/molecules/news-card";

export const metadata: Metadata = {
  title: "Blogs | WMA",
  description:
    "West Migration Agency Blog - Immigration Updates, News, and Insights",
};

export default function BlogsPage() {
  return (
    <section className="bg-white">
      <div className="mb-2 border-b border-wma-darkTeal">
        <h1 className="mx-auto max-w-[1280px] px-4 py-6 text-4xl font-bold sm:py-10 sm:text-5xl md:px-8 md:py-14 md:text-6xl lg:py-20 lg:text-7xl xl:px-20 xl:text-8xl">
          WMA Blogs
        </h1>
      </div>
      <Carousel>
        <BlogsCarouselDots items={preparedBlogData} />
        <CarouselContent>
          {preparedBlogData.map((blog, i) => (
            <CarouselItem key={i}>
              {blog.posts.map((post, j) => (
                <NewsCard key={j} post={post} category={blog.category} />
              ))}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
