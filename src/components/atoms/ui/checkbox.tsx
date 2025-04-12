// src/app/components/atoms/ui/checkbox.tsx
import { dm_sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import * as React from "react";

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          dm_sans.className,
          "h-4 w-4 rounded border-wma-darkTeal text-wma-gold focus:ring-wma-gold focus:ring-offset-wma-gold",
          "transition-all ease-in-out focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };