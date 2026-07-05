"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Touch-friendly button with larger tap target
interface TouchButtonProps {
  children: React.ReactNode;
  className?: string;
  minSize?: number;
}

export function TouchButton({ children, className, minSize = 44 }: TouchButtonProps) {
  return (
    <button
      className={cn("relative", className)}
      style={{
        minHeight: `${minSize}px`,
        minWidth: `${minSize}px`,
      }}
    >
      {children}
    </button>
  );
}

// Swipe gesture handler
interface SwipeProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export function Swipe({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
}: SwipeProps) {
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={className}
    >
      {children}
    </div>
  );
}

// Pull to refresh
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const startYRef = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      startYRef.current = touch.clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    const currentY = touch.clientY;
    const distance = currentY - startYRef.current;

    if (distance > 0) {
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        className="flex items-center justify-center py-4"
        animate={{ height: pullDistance }}
        style={{ minHeight: 0 }}
      >
        {isRefreshing ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <motion.div
            animate={{ rotate: pullDistance / 2 }}
            style={{ opacity: pullDistance / threshold }}
          >
            ↓
          </motion.div>
        )}
      </motion.div>
      {children}
    </div>
  );
}

// Bottom sheet for mobile
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ isOpen, onClose, children, className }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl z-50 p-6 md:hidden",
              className
            )}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Safe area padding for mobile devices with notches
interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export function SafeArea({
  children,
  className,
  top = true,
  bottom = true,
  left = false,
  right = false,
}: SafeAreaProps) {
  return (
    <div
      className={cn(
        "bg-background",
        top && "pt-safe-top",
        bottom && "pb-safe-bottom",
        left && "pl-safe-left",
        right && "pr-safe-right",
        className
      )}
      style={{
        paddingTop: top ? "env(safe-area-inset-top)" : undefined,
        paddingBottom: bottom ? "env(safe-area-inset-bottom)" : undefined,
        paddingLeft: left ? "env(safe-area-inset-left)" : undefined,
        paddingRight: right ? "env(safe-area-inset-right)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

// Responsive container with breakpoint detection
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={cn(isMobile ? "px-4" : "px-8", className)}>
      {children}
    </div>
  );
}

// Haptic feedback simulation (visual feedback for touch)
interface HapticFeedbackProps {
  children: React.ReactNode;
  type?: "light" | "medium" | "heavy";
  className?: string;
}

export function HapticFeedback({
  children,
  type = "light",
  className,
}: HapticFeedbackProps) {
  const handlePress = () => {
    // Visual feedback as fallback
    if (navigator.vibrate) {
      const duration = type === "light" ? 10 : type === "medium" ? 25 : 50;
      navigator.vibrate(duration);
    }
  };

  return (
    <div
      onTouchStart={handlePress}
      onMouseDown={handlePress}
      className={className}
    >
      {children}
    </div>
  );
}

// Long press handler
interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  delay?: number;
  className?: string;
}

export function LongPress({
  children,
  onLongPress,
  delay = 500,
  className,
}: LongPressProps) {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    timerRef.current = setTimeout(onLongPress, delay);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={className}
    >
      {children}
    </div>
  );
}
