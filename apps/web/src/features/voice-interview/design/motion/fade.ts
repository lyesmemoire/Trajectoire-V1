import { durations, easing } from "../tokens";

// Utility to handle prefers-reduced-motion in Framer Motion variants
export const withReducedMotion = (variant: any, reducedVariant: any = { opacity: 1, transition: { duration: 0 } }) => {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? reducedVariant
    : variant;
};

export const fade = {
  in: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: parseFloat(durations.normal) / 1000, ease: easing.out },
  },
  slow: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: parseFloat(durations.slow) / 1000, ease: easing.inOut },
  },
};
