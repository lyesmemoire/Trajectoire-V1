import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-surface-secondary text-text-secondary shadow-sm",
        primary:
          "border-transparent bg-primary-soft text-primary",
        success:
          "border-transparent bg-success-light text-success",
        warning:
          "border-transparent bg-warning-light text-warning",
        destructive:
          "border-transparent bg-danger-light text-danger",
        outline: "text-text-muted border-border-default bg-surface/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
