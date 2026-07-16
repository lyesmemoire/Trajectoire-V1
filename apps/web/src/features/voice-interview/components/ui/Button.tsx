import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20",
        secondary:
          "bg-surface-secondary text-text-primary hover:bg-border-default/50",
        outline:
          "border border-border-default bg-surface hover:bg-surface-secondary text-text-secondary",
        ghost: "hover:bg-surface-secondary text-text-muted",
        destructive:
          "bg-warning-light text-danger hover:bg-warning/20 shadow-sm shadow-warning/20",
      },
      size: {
        default: "h-14 px-8 py-4 text-base",
        sm: "h-11 rounded-xl px-5 text-sm",
        lg: "h-16 rounded-2xl px-10 text-lg",
        xl: "h-20 rounded-3xl px-12 text-xl",
        icon: "h-14 w-14 rounded-full",
        iconLg: "h-16 w-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
