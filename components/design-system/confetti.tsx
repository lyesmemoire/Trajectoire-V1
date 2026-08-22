"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

export function Confetti({
  trigger = false,
  duration = 3000,
  particleCount = 100,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = React.useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    velocity: { x: number; y: number };
    rotation: number;
  }>>([]);

  React.useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: 50,
        y: 50,
        color: getRandomColor(),
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20 - 10,
        },
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, particleCount, duration, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: "50%",
              y: "50%",
              rotate: 0,
              scale: 0,
            }}
            animate={{
              x: `calc(${particle.x}% + ${particle.velocity.x * 10}px)`,
              y: `calc(${particle.y}% + ${particle.velocity.y * 10}px)`,
              rotate: particle.rotation,
              scale: 1,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function getRandomColor(): string {
  const colors = [
    "#1E40AF", // primary
    "#10B981", // success
    "#F59E0B", // warning
    "#EF4444", // error
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
  ];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index] || "#1E40AF";
}

// Simple confetti burst for quick success feedback
export function ConfettiBurst({
  trigger = false,
  onComplete,
}: { trigger?: boolean; onComplete?: () => void }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="relative"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i / 20) * Math.PI * 2) * 200,
              y: Math.sin((i / 20) * Math.PI * 2) * 200,
              opacity: 0,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: getRandomColor(),
              borderRadius: "2px",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
