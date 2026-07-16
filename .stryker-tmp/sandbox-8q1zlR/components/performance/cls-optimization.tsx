// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// CLS (Cumulative Layout Shift) optimization utilities

// Reserve space for dynamic content to prevent CLS
export function ReserveSpace({
  width,
  height,
  children,
  className,
}: {
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: width || "100%",
        height: height || "auto",
        minHeight: height || undefined,
      }}
    >
      {children}
    </div>
  );
}

// Aspect ratio container to prevent CLS
export function AspectRatioContainer({
  ratio = 16 / 9,
  children,
  className,
}: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(1 / ratio) * 100}%`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Skeleton placeholder to prevent CLS
export function CLSSkeleton({
  width,
  height,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse bg-gray-200", className)}
      style={{
        width: width || "100%",
        height: height || "100%",
      }}
      aria-hidden="true"
    />
  );
}

// Image with explicit dimensions to prevent CLS
export function CLSOptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  width: number;
  height: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}

// Font with fallback to prevent CLS
export function CLSOptimizedFont({
  children,
  fontFamily,
  fallbackFont = "sans-serif",
  className,
}: {
  children: React.ReactNode;
  fontFamily: string;
  fallbackFont?: string;
  className?: string;
}) {
  const [isFontLoaded, setIsFontLoaded] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const checkFont = () => {
      const testString = "mmmmmmmmmmlli";
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      context.font = `48px "${fontFamily}", ${fallbackFont}`;
      const testWidth = context.measureText(testString).width;

      context.font = `48px ${fallbackFont}`;
      const fallbackWidth = context.measureText(testString).width;

      setIsFontLoaded(testWidth !== fallbackWidth);
    };

    checkFont();
    const interval = setInterval(checkFont, 100);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fontFamily, fallbackFont]);

  return (
    <span
      className={className}
      style={{
        fontFamily: isFontLoaded ? fontFamily : fallbackFont,
        transition: "font-family 0.3s ease",
      }}
    >
      {children}
    </span>
  );
}

// Reserve space for ads or dynamic content
export function AdPlaceholder({
  width = 300,
  height = 250,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-gray-100 flex items-center justify-center", className)}
      style={{ width, height }}
      aria-label="Publicité"
    >
      <span className="text-sm text-text-muted">Espace publicitaire</span>
    </div>
  );
}

// Video with aspect ratio to prevent CLS
export function CLSOptimizedVideo({
  src,
  poster,
  className,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <video
        src={src}
        poster={poster}
        className={cn("absolute top-0 left-0 w-full h-full object-cover", className)}
        preload="metadata"
        {...props}
      />
    </div>
  );
}

// Iframe with aspect ratio to prevent CLS
export function CLSOptimizedIframe({
  src,
  title,
  className,
  ratio = 16 / 9,
  ...props
}: React.IframeHTMLAttributes<HTMLIFrameElement> & {
  ratio?: number;
}) {
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: `${(1 / ratio) * 100}%` }}>
      <iframe
        src={src}
        title={title}
        className={cn("absolute top-0 left-0 w-full h-full", className)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}

// Dynamic content with reserved space
export function DynamicContent({
  isLoading,
  children,
  placeholder,
  width,
  height,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <ReserveSpace width={width} height={height}>
      {isLoading ? (
        placeholder || <CLSSkeleton width={width} height={height} />
      ) : (
        children
      )}
    </ReserveSpace>
  );
}

// CLS score monitor (for development)
export function useCLSMonitor() {
  const [clsScore, setCLSScore] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
          const value = (entry as any).value;
          if (typeof value === "number") {
            setCLSScore((prev) => prev + value);
          }
        }
      }
    });

    observer.observe({ type: "layout-shift", buffered: true });

    return () => observer.disconnect();
  }, []);

  return clsScore;
}

// CLS warning component (development only)
export function CLSWarning({ threshold = 0.1 }: { threshold?: number }) {
  const clsScore = useCLSMonitor();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50",
        clsScore > threshold ? "bg-error text-white" : "bg-success text-white"
      )}
    >
      <div className="font-medium">CLS Score: {clsScore.toFixed(4)}</div>
      <div className="text-sm opacity-90">
        {clsScore > threshold ? "Above threshold!" : "Good"}
      </div>
    </div>
  );
}

// Content visibility API for lazy loading
export function useContentVisibility({
  threshold = 0.5,
  rootMargin = "0px",
}: {
  threshold?: number;
  rootMargin?: string;
} = {}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting || false);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

// Reserve space for dynamic height content
export function DynamicHeightReserve({
  minHeight,
  children,
  className,
}: {
  minHeight: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} style={{ minHeight }}>
      {children}
    </div>
  );
}

// Prevent layout shift on font load
export function useFontCLSPrevention(fontFamily: string) {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    document.fonts.ready.then(() => {
      setIsReady(true);
    });
  }, []);

  return isReady;
}
