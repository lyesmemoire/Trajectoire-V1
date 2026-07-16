"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface FadeInProps {
  children: ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  /** Direction from which the element fades in. Default: "up" */
  direction?: Direction;
  /** Distance in px for the slide. Default: 8 */
  distance?: number;
  /** Animation duration in seconds. Default: 0.4 */
  duration?: number;
  /** HTML tag to render. Default: "div" */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "span";
  className?: string;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 8 },
  down: { y: -8 },
  left: { x: 8 },
  right: { x: -8 },
};

/**
 * Lightweight fade-in animation wrapper using LazyMotion + domAnimation.
 *
 * Instead of importing the full `motion` bundle (~30 kB), this uses
 * `m` + `LazyMotion` which tree-shakes down to ~5 kB.
 *
 * Usage:
 *   <FadeIn delay={0.1}>
 *     <MyComponent />
 *   </FadeIn>
 *
 *   <FadeIn delay={0.2} direction="left">
 *     <Sidebar />
 *   </FadeIn>
 */
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 8,
  duration = 0.4,
  as = "div",
  className,
}: FadeInProps) {
  const Component = m[as];
  const offset = directionMap[direction];
  const initial = {
    opacity: 0,
    ...(offset.x !== undefined ? { x: offset.x > 0 ? distance : -distance } : {}),
    ...(offset.y !== undefined ? { y: offset.y > 0 ? distance : -distance } : {}),
  };

  return (
    <LazyMotion features={domAnimation}>
      <Component
        initial={initial}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </Component>
    </LazyMotion>
  );
}
