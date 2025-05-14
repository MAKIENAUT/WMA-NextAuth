import { cn } from "@/lib/utils";
import React from "react";

interface ContentCardProps {
  description: string;
  className?: string;
}

export default function ContentCard({
  description,
  className,
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-r from-wma-darkTeal to-wma-teal p-4 text-white md:px-8",
        className
      )}
    >
      <p className="lg:text-lg">{description}</p>
    </div>
  );
}
