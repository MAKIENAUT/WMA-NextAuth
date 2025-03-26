import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { orelega_one } from "@/lib/fonts";
import Image from "next/image";

export const hero_items = {
  home: {
    title: "Venture West:",
    highlightedText: "Where Dreams Take Flight",
    imageSrc: "/san-fran-bridge.jpeg",
    imageAlt: "San Francisco bridge",
  },
  "study-and-exchange": {
    title: "Study Abroad:",
    highlightedText: "Unlock Your Potential",
    imageSrc: "/student-services.jpg",
    imageAlt: "University campus scene",
  },
  "family-based": {
    title: "Family Visas:",
    highlightedText: "Hearts Across Borders",
    imageSrc: "/family-services.jpg",
    imageAlt: "Family reunion moment",
  },
  "temporary-employment": {
    title: "Work in the USA:",
    highlightedText: "Your Path to Success",
    imageSrc: "/forklift-services.jpg",
    imageAlt: "Professional office environment",
  },
  "web-development": {
    title: "Orb-Weaver:",
    highlightedText: "Your Digital Silk Road",
    imageSrc: "/web-development.jpg",
    imageAlt: "Modern web development workspace",
  },
};

interface HeaderGroupProps {
  children: ReactNode;
  className?: string;
}

function HeaderGroup({ children, className }: HeaderGroupProps) {
  return (
    <div
      className={cn(
        "mx-auto h-full w-full max-w-[1440px]",
        "sm:grid sm:grid-cols-[70%_auto] lg:grid-cols-[65%_auto] xl:grid-cols-[60%_auto]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface HeaderTextProps {
  title: string;
  highlightedText: string;
  className?: string;
  titleClassName?: string;
}

function HeaderText({
  title,
  highlightedText,
  className,
  titleClassName,
}: HeaderTextProps) {
  return (
    <div
      className={cn(
        "relative z-10",
        "px-6 py-10",
        `sm:bg-gradient-to-r sm:from-wma-darkTeal sm:to-wma-teal sm:px-8 sm:py-14 sm:[clip-path:polygon(0_0,100%_0,86%_100%,0%_100%)]`,
        "md:py-16",
        "lg:px-12 lg:py-20",
        "xl:px-20 xl:py-28",
        className
      )}
    >
      <h1
        className={cn(
          orelega_one.className,
          "max-w-[400px] text-4xl",
          "sm:text-5xl",
          "md:max-w-[420px] md:text-6xl",
          "lg:max-w-[500px] lg:text-7xl",
          "xl:max-w-[640px] xl:text-[5.5rem]",
          "text-white",
          titleClassName
        )}
      >
        {title} <span className="text-wma-gold">{highlightedText}</span>
      </h1>
    </div>
  );
}

interface HeaderImageProps {
  imageSrc: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

function HeaderImage({
  imageSrc,
  alt,
  className,
  imageClassName,
}: HeaderImageProps) {
  return (
    <div
      className={cn(
        "relative right-[5.5rem] hidden h-full max-h-[256px] w-[350px]",
        "sm:block",
        "md:right-[7.5rem] md:max-h-[308px] md:w-[480px]",
        "lg:right-[8.5rem] lg:max-h-[376px] lg:w-[630px]",
        "xl:right-[9rem] xl:max-h-[488px] xl:w-[780px]",
        "min-[1440px]:w-[900px]",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={cn("size-full object-cover object-center", imageClassName)}
        sizes="(max-width: 1280) 33vw, 50vw"
      />
    </div>
  );
}
export interface HeroItems {
  title: string;
  highlightedText: string;
  imageSrc: string;
  imageAlt: string;
}

interface HeroTemplateProps {
  route: keyof typeof hero_items;
  className?: string;
  customConfig?: HeroItems;
}

export default function HeroTemplate({
  route,
  className,
  customConfig,
}: HeroTemplateProps) {
  const config = customConfig || hero_items[route] || hero_items.home;

  return (
    <header
      className={cn(
        "relative flex min-h-[200px] items-center overflow-hidden bg-gradient-to-r from-wma-darkTeal to-wma-teal sm:bg-wma-darkTeal",
        "mb-8 sm:mb-10 md:mb-12 lg:mb-16",
        className
      )}
    >
      <HeaderGroup>
        <HeaderText
          title={config.title}
          highlightedText={config.highlightedText}
        />
        <HeaderImage imageSrc={config.imageSrc} alt={config.imageAlt} />
      </HeaderGroup>
    </header>
  );
}
