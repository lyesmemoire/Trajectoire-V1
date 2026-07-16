// @ts-nocheck
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AuthArenaLayoutProps {
  children: React.ReactNode;
  quote?: string;
  author?: string;
  image?: string;
  showLeftPanel?: boolean;
}

export function AuthArenaLayout({
  children,
  quote = "Reprenons votre préparation là où vous l'avez laissée.",
  author = "Trajectoire",
  image = "/images/login-executive.jpg",
  showLeftPanel = true,
}: AuthArenaLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
      {/* Left Panel - Image with Quote */}
      {showLeftPanel && (
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-end">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt="Cadre dirigeant préparant sa stratégie d'entretien"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 p-12 text-white"
          >
            <p className="font-serif text-2xl leading-relaxed mb-5 max-w-md opacity-95">
              « {quote} »
            </p>
            <p className="text-sm font-medium opacity-75 tracking-wide">— {author}</p>
          </motion.div>
        </div>
      )}

      {/* Right Panel - Content */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
        {children}
      </div>
    </div>
  );
}
