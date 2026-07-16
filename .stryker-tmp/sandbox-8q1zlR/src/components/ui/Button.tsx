// @ts-nocheck
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:   'bg-sage-600 text-white shadow-soft-sm hover:bg-sage-700 hover:shadow-soft-md',
        secondary: 'bg-white text-sage-700 border border-sage-200 hover:bg-sage-50',
        ghost:     'text-sage-700 hover:bg-sage-50',
        premium:   'bg-gradient-to-r from-sage-600 to-sage-500 text-white shadow-soft-md hover:shadow-soft-lg',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-12 px-6 text-base rounded-lg',
        lg: 'h-14 px-8 text-lg rounded-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';