import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold ring-offset-white transition-all ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wma-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-wma-gold text-black hover:bg-wma-darkGold active:bg-wma-gold",
        destructive:
          "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
        outline:
          "ring-2 ring-transparent hover:ring-wma-teal hover:text-wma-teal active:ring-wma-darkTeal active:text-wma-darkTeal",
        secondary:
          "bg-wma-teal text-white hover:bg-wma-darkTeal active:bg-wma-teal",
        ghost: "hover:bg-zinc-100 hover:text-wma-darkTeal",
        link: "hover:text-wma-teal underline-offset-4 hover:underline active:text-wma-darkTeal font-medium",
        "link-footer":
          "hover:text-wma-gold items-start justify-normal hover:underline underline-offset-4 active:text-wma-darkGold font-medium w-fit",
        carousel:
          "rounded-none border-b-2 border-transparent hover:text-wma-darkTeal text-[#7E7E7E] sm:text-lg xl:text-xl",
        service:
          "bg-teal-800 text-white hover:bg-teal-900 transition-colors sm:text-lg lg:text-xl",
        logo: "",
      },
      size: {
        default: "px-4 py-2",
        sm: "p-2",
        lg: "px-8",
        icon: "h-10 w-10",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
