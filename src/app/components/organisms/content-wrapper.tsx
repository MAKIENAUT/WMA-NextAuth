import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ContentWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[1280px] flex-col items-center justify-center px-4 py-8 sm:px-8 md:p-12 lg:px-20 lg:py-10 xl:px-24 xl:py-12",
        className
      )}
    >
      {children}
    </div>
  );
}
