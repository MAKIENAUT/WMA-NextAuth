"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { NewsCard } from "@/app/components/molecules/news-card";
import {
  BlogsCarouselDots,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/components/organisms/carousel";
import { preparedBlogData } from "@/app/data/blogData";

export default function BlogsPage() {
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [visiblePosts, setVisiblePosts] = useState<number>(9);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisiblePosts((prev) => prev + 9);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [carouselApi, selectedIndex]);

  useEffect(() => {
    if (carouselApi) {
      const onSelect = () => {
        setSelectedIndex(carouselApi.selectedScrollSnap());
        setVisiblePosts(9);
      };
      carouselApi.on("select", onSelect);
      return () => {
        carouselApi.off("select", onSelect);
      };
    }
  }, [carouselApi]);

  return (
    <section className="bg-white">
      <div className="mb-2 border-b border-wma-darkTeal">
        <h1 className="mx-auto max-w-[1280px] px-4 py-6 text-4xl font-bold sm:py-10 sm:text-5xl md:px-8 md:py-14 md:text-6xl lg:py-20 lg:text-7xl xl:px-20 xl:text-8xl">
          WMA Blogs
        </h1>
      </div>
      <Carousel opts={{ watchDrag: false }} setApi={setCarouselApi}>
        <BlogsCarouselDots items={preparedBlogData} />
        <CarouselContent>
          {preparedBlogData.map((blog, i) => (
            <CarouselItem key={i}>
              {selectedIndex === i && (
                <>
                  <div className="flex flex-wrap justify-center gap-6 w-full">
                    {blog.posts.slice(0, visiblePosts).map((post, j) => (
                      <div
                        key={j}
                        className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-fit"
                      >
                        <NewsCard post={post} category={blog.category} />
                      </div>
                    ))}
                  </div>

                  {blog.posts.length > visiblePosts && (
                    <div
                      ref={loadMoreRef}
                      className="w-full flex justify-center p-4 text-wma-teal"
                    >
                      <div className="animate-pulse">Loading more posts...</div>
                    </div>
                  )}
                </>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
