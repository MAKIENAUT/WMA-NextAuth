import * as React from "react";

import { cn } from "@/lib/utils";
import { dm_sans } from "@/lib/fonts";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          dm_sans.className,
          "inline-flex w-full rounded-md border border-wma-darkTeal bg-white px-3 py-2 text-base font-medium ring-offset-white transition-all ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wma-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
