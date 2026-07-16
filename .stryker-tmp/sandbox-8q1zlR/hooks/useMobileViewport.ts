// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

/**
 * Hook de résilience du Viewport Mobile.
 * Détecte l'ouverture du clavier et verrouille le layout pour éviter les "scroll jumps" cognitifs.
 */
export function useMobileViewport() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;

      // Si la hauteur chute de plus de 20%, le clavier est probablement ouvert
      if (viewportHeight > 0 && currentHeight < viewportHeight * 0.8) {
        setKeyboardOpen(true);
      } else {
        setKeyboardOpen(false);
        setViewportHeight(currentHeight);
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    setViewportHeight(window.visualViewport?.height || window.innerHeight);

    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, [viewportHeight]);

  return { keyboardOpen, viewportHeight };
}
