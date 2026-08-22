"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Enhanced hover effect wrapper
interface HoverEffectProps {
  children: React.ReactNode;
  scale?: number;
  lift?: boolean;
  glow?: boolean;
  className?: string;
}

export function HoverEffect({
  children,
  scale = 1.05,
  lift = true,
  glow = false,
  className,
}: HoverEffectProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "transition-all duration-300",
        lift && "hover:-translate-y-1",
        glow && "hover:shadow-lg hover:shadow-primary/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Focus visible enhancement for accessibility
interface FocusVisibleProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export function FocusVisible({
  children,
  className,
  offset = 2,
}: FocusVisibleProps) {
  return (
    <div className={cn("relative", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const existingClassName = (child.props as any).className || "";
          const existingStyle = (child.props as any).style || {};
          return React.cloneElement(child, {
            className: cn(
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              existingClassName
            ),
            style: {
              ...existingStyle,
              "--tw-ring-offset-width": `${offset}px`,
            },
          } as any);
        }
        return child;
      })}
    </div>
  );
}

// Ripple effect for buttons (Material Design style)
interface RippleProps {
  children: React.ReactNode;
  className?: string;
}

export function Ripple({ children, className }: RippleProps) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      {children}
    </div>
  );
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 20,
  className,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({
      x: x / strength,
      y: y / strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tooltip with smooth animation
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap",
              positionStyles[position],
              className
            )}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Press feedback for touch devices
interface PressFeedbackProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function PressFeedback({
  children,
  scale = 0.95,
  className,
}: PressFeedbackProps) {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover card with reveal effect
interface HoverCardProps {
  children: React.ReactNode;
  reveal?: React.ReactNode;
  className?: string;
}

export function HoverCard({ children, reveal, className }: HoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && reveal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center"
          >
            {reveal}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
