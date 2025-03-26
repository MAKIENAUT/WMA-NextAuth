"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
      setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onDotButtonClick = React.useCallback(
      (index: number) => {
        if (!api) return;
        api.scrollTo(index);
      },
      [api]
    );

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }
      setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    React.useEffect(() => {
      if (!api) return;

      onInit(api);
      onSelect(api);
      api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
    }, [api, onInit, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          selectedIndex,
          scrollSnaps,
          onDotButtonClick,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "relative mx-auto max-w-[1280px] px-4 pb-32 md:px-8 lg:px-20",
            className
          )}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "" : "flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "grid min-w-0 shrink-0 grow-0 basis-full gap-8 p-4 sm:grid-cols-2 md:pt-8 lg:grid-cols-3 xl:pt-10",
        orientation === "horizontal" ? "" : "",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const BlogsCarouselDots = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { items: { category: string }[] }
>(({ items, className, variant = "carousel", size, ...props }, ref) => {
  const { selectedIndex, onDotButtonClick } = useCarousel();

  return (
    <div className="flex border-b border-black">
      {items.map((item, index) => (
        <Button
          key={index}
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            index === selectedIndex && "border-wma-darkTeal text-wma-darkTeal",
            className
          )}
          onClick={() => onDotButtonClick(index)}
          {...props}
        >
          {item.category === "news"
            ? "News"
            : item.category === "posts"
              ? "Posts"
              : item.category === "all"
                ? "All"
                : item.category === "updates"
                  ? "Updates"
                  : item.category.slice(0, 1).toUpperCase() +
                    item.category.slice(1)}
          <span className="sr-only">{item.category}</span>
        </Button>
      ))}
    </div>
  );
});

BlogsCarouselDots.displayName = "BlogCarouselDots";

const ServiceCarouselDots = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    data: { title: string }[];
  }
>(({ data, className, variant = "carousel", size, ...props }, ref) => {
  const { selectedIndex, onDotButtonClick } = useCarousel();

  return (
    <div className="flex border-b border-black">
      {data.map((data, index) => (
        <Button
          key={index}
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            index === selectedIndex && "border-wma-darkTeal text-wma-darkTeal",
            className
          )}
          onClick={() => onDotButtonClick(index)}
          {...props}
        >
          {data.title.slice(0, 1).toUpperCase() + data.title.slice(1)}
          <span className="sr-only">{data.title}</span>
        </Button>
      ))}
    </div>
  );
});
ServiceCarouselDots.displayName = "ServiceCarouselDots";

export {
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  Carousel,
  BlogsCarouselDots,
  ServiceCarouselDots,
};
