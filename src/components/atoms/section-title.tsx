import React from "react";
import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  prefix?: string;
  title: string;
  className?: string;
}

export default function SectionTitle({
  prefix,
  title,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(className)}>
      {prefix && (
        <h1
          className={`text-4xl font-bold sm:text-5xl lg:text-6xl ${orelega_one.className}`}
        >
          {prefix}
        </h1>
      )}
      <h2
        className={`text-4xl font-bold text-teal-800 sm:text-5xl lg:text-6xl ${orelega_one.className}`}
      >
        {title}
      </h2>
    </div>
  );
}
