"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Shake animation for error feedback
interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Shake({ children, trigger, className }: ShakeProps) {
  return (
    <motion.div
      animate={trigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bounce animation for attention
interface BounceProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Bounce({ children, trigger, className }: BounceProps) {
  return (
    <motion.div
      animate={trigger ? { y: [0, -20, 0] } : {}}
      transition={{ duration: 0.5, times: [0, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for live indicators
interface PulseProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function Pulse({ children, className, color = "bg-primary" }: PulseProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <motion.span
        className={cn("absolute inline-flex rounded-full opacity-75", color)}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.75, 0.5, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// Typing animation for text
interface TypingAnimationProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingAnimation({
  text,
  className,
  speed = 50,
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
}

// Counter animation for numbers
interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  value,
  duration = 1,
  className,
  prefix = "",
  suffix = "",
}: CounterProps) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCurrent(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

// Heart animation for likes/favorites
interface HeartProps {
  liked?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Heart({ liked = false, onToggle, className }: HeartProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={cn("relative", className)}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={liked ? "#EF4444" : "none"}
        stroke={liked ? "#EF4444" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ scale: 1 }}
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
    </motion.button>
  );
}

// Checkbox animation
interface AnimatedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export function AnimatedCheckbox({
  checked = false,
  onChange,
  className,
  label,
}: AnimatedCheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
      <motion.div
        className="relative w-5 h-5 border-2 rounded-md"
        animate={{
          borderColor: checked ? "#1E40AF" : "#E5E7EB",
          backgroundColor: checked ? "#1E40AF" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.svg
          className="absolute top-0.5 left-0.5 w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>
      {label && <span className="text-sm">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

// Switch/toggle animation
interface AnimatedSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export function AnimatedSwitch({
  checked = false,
  onChange,
  className,
  label,
}: AnimatedSwitchProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
      <motion.div
        className="relative w-11 h-6 rounded-full"
        animate={{
          backgroundColor: checked ? "#1E40AF" : "#E5E7EB",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{
            x: checked ? 20 : 4,
          }}
          transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
      {label && <span className="text-sm">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

// Copy to clipboard with feedback
interface CopyButtonProps {
  text: string;
  className?: string;
  copiedText?: string;
}

export function CopyButton({ text, className, copiedText = "Copié!" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={cn("relative", className)}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-success text-sm font-medium"
          >
            {copiedText}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Copier
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Rating stars with hover animation
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  className?: string;
}

export function Rating({ value, onChange, max = 5, className }: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState(0);

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverValue || value);
        const isHalfFilled = !isFilled && starValue - 0.5 <= (hoverValue || value);

        return (
          <motion.button
            key={i}
            type="button"
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange?.(starValue)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFilled ? "#F59E0B" : "none"}
              stroke={isFilled ? "#F59E0B" : "#E5E7EB"}
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}
