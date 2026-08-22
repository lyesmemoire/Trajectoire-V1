"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md",
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
        secondary:
          "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        outline:
          "bg-transparent text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        ghost:
          "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        link:
          "bg-transparent text-blue-600 underline-offset-4 hover:underline px-0",
        success:
          "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md",
        error:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-[52px] px-6",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-[52px] w-[52px]",
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
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const buttonContent = (
      <>
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        <span className={cn("inline-flex items-center gap-2", loading && "opacity-80")}>{children}</span>
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? <span className="inline-flex items-center justify-center gap-2">{buttonContent}</span> : buttonContent}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
