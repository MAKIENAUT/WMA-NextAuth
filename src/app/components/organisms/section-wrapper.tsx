import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SectionWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("mb-12 px-4 sm:px-8 md:mb-16 lg:mb-24 xl:px-20", className)}
    >
      {children}
    </section>
  );
}
