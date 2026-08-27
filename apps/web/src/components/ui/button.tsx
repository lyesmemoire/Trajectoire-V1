import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'premium' | 'link' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-900 text-ivoire-50 hover:bg-ink-800 shadow-premium hover:shadow-premium-lg',
  secondary:
    'bg-white text-ink-900 border border-ivoire-300 hover:border-ink-900',
  ghost:
    'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ivoire-100',
  premium:
    'bg-bronze-600 text-white hover:bg-bronze-700 shadow-premium hover:shadow-premium-lg',
  link:
    'bg-transparent text-ink-900 underline-offset-4 hover:underline p-0 h-auto',
  danger:
    'bg-brick-600 text-white hover:bg-brick-700 shadow-premium hover:shadow-premium-lg',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-full font-medium tracking-wide
          transition-all duration-300 ease-premium
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ivoire-50
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          ${variantStyles[variant]}
          ${variant !== 'link' ? sizeStyles[size] : ''}
          ${className}
        `}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
