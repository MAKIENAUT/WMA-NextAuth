import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
  children: ReactNode;
  gradient?: string;
}

export default function HeroSection({
  className = "",
  children,
  gradient = "from-wma-darkTeal to-wma-teal",
}: HeroSectionProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden",
        // Add background gradient here
        "bg-gradient-to-r",
        gradient,
        "h-[250px]",
        "sm:h-[250px]",
        "md:h-[300px]",
        "lg:h-[380px]",
        "xl:h-[480px]",
        "mb-8",
        "sm:mb-10",
        "md:mb-12",
        "lg:mb-16",
        className
      )}
    >
      {children}
    </header>
  );
}
