"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  x: number;
  y: number;
  opacity: number;
  duration: number;
};

export function CinematicBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5,
      duration: 10 + Math.random() * 20,
    }));

    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-white/20 rounded-full"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 10}%`],
            opacity: [particle.opacity, particle.opacity * 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}
