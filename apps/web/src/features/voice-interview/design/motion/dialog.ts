import { easing } from "../tokens";
import { withReducedMotion } from "./fade";

export const dialog = {
  overlay: {
    initial: { opacity: 0, backdropFilter: "blur(0px)" },
    animate: { opacity: 1, backdropFilter: "blur(8px)" },
    exit: { opacity: 0, backdropFilter: "blur(0px)" },
    transition: { duration: 0.5, ease: easing.out },
  },
  content: {
    initial: withReducedMotion(
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 0 }
    ),
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: withReducedMotion(
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 0 }
    ),
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300,
      mass: 0.5
    },
  },
};
