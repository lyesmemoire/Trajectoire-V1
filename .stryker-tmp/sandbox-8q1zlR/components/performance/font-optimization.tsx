// @ts-nocheck
"use client";

import * as React from "react";

// Font optimization utilities
export function useFontPreload(fontUrls: string[]) {
  React.useEffect(() => {
    fontUrls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.href = url;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }, [fontUrls]);
}

// Font display strategy
export function withFontDisplay(
  fontFace: string,
  display: "auto" | "block" | "swap" | "fallback" | "optional" = "swap"
) {
  return fontFace.replace(/font-display:\s*[^;]+;/, `font-display: ${display};`);
}

// Critical font inlining
export function getCriticalFontCSS(fontName: string, fontUrl: string) {
  return `
    @font-face {
      font-family: '${fontName}';
      src: url('${fontUrl}') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
}

// Font subset optimization (client-side)
export function useFontSubsets(fonts: Array<{ name: string; characters: string }>) {
  React.useEffect(() => {
    fonts.forEach(({ name, characters }) => {
      // This would typically call a font subsetting API
      console.log(`Optimizing font subset for ${name} with characters: ${characters}`);
    });
  }, [fonts]);
}

// Font loading observer
export function useFontLoadingObserver(fontFamily: string) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const checkFontLoaded = () => {
      const testString = "mmmmmmmmmmlli";
      const testFont = `48px "${fontFamily}", sans-serif`;
      const defaultFont = "48px sans-serif";

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      context.font = testFont;
      const testWidth = context.measureText(testString).width;

      context.font = defaultFont;
      const defaultWidth = context.measureText(testString).width;

      setIsLoaded(testWidth !== defaultWidth);
    };

    // Check immediately
    checkFontLoaded();

    // Check periodically
    const interval = setInterval(checkFontLoaded, 100);

    // Stop checking after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fontFamily]);

  return isLoaded;
}

// Font swap component
export function FontSwap({
  children,
  fontFamily,
  fallbackFont = "sans-serif",
}: {
  children: React.ReactNode;
  fontFamily: string;
  fallbackFont?: string;
}) {
  const isLoaded = useFontLoadingObserver(fontFamily);

  return (
    <span
      style={{
        fontFamily: isLoaded ? fontFamily : fallbackFont,
        transition: "font-family 0.3s ease",
      }}
    >
      {children}
    </span>
  );
}

// Variable font optimization
export function useVariableFont(fontUrl: string, axes: Record<string, number>) {
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.href = fontUrl;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    // Set font variation settings
    const style = document.createElement("style");
    const axisSettings = Object.entries(axes)
      .map(([axis, value]) => `'${axis}' ${value}`)
      .join(", ");
    style.textContent = `
      @font-face {
        font-family: 'VariableFont';
        src: url('${fontUrl}') format('woff2-variations');
        font-weight: 100 900;
        font-stretch: 75% 125%;
        font-display: swap;
      }
      .variable-font {
        font-family: 'VariableFont', sans-serif;
        font-variation-settings: ${axisSettings};
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, [fontUrl, axes]);
}

// Font loading state
export function useFontLoadingState(fonts: string[]) {
  const [loadedFonts, setLoadedFonts] = React.useState<Set<string>>(new Set());
  const [failedFonts, setFailedFonts] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    // Fallback: assume fonts are loaded (FontFaceObserver requires external library)
    fonts.forEach((font) => {
      setLoadedFonts((prev) => new Set(prev).add(font));
    });
  }, [fonts]);

  return {
    loadedFonts,
    failedFonts,
    isLoaded: (font: string) => loadedFonts.has(font),
    isFailed: (font: string) => failedFonts.has(font),
    allLoaded: fonts.every((font) => loadedFonts.has(font)),
  };
}

// System font stack optimization
export const systemFontStack = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
].join(", ");

// Monospace font stack
export const monospaceFontStack = [
  "SFMono-Regular",
  "Consolas",
  "Liberation Mono",
  "Menlo",
  "monospace",
].join(", ");

// Font size clamp for responsive typography
export function useResponsiveFontSize(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1200
) {
  const clamp = React.useMemo(() => {
    return `clamp(${minSize}px, calc(${minSize}px + (${maxSize - minSize}) * ((100vw - ${minViewport}px) / (${maxViewport - minViewport}))), ${maxSize}px)`;
  }, [minSize, maxSize, minViewport, maxViewport]);

  return clamp;
}

// Font optimization hook
export function useFontOptimization() {
  const [isOptimized, setIsOptimized] = React.useState(false);

  React.useEffect(() => {
    // Check if browser supports font-display
    if (typeof document !== "undefined") {
      const testFont = new FontFace("test", "url(data:font/woff2;base64,)");
      testFont.load().then(() => {
        setIsOptimized(true);
      }).catch(() => {
        setIsOptimized(false);
      });
    }
  }, []);

  return isOptimized;
}
