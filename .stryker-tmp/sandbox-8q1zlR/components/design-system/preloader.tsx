// @ts-nocheck
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Intelligent route preloader
export function useRoutePreloader() {
  const router = useRouter();
  const [prefetchedRoutes, setPrefetchedRoutes] = React.useState<Set<string>>(new Set());

  const prefetchRoute = React.useCallback((path: string) => {
    if (!prefetchedRoutes.has(path)) {
      router.prefetch(path);
      setPrefetchedRoutes((prev) => new Set(prev).add(path));
    }
  }, [router, prefetchedRoutes]);

  return { prefetchRoute };
}

// Image preloader for better perceived performance
interface ImagePreloaderProps {
  src: string;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export function ImagePreloader({ src, onComplete, children }: ImagePreloaderProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      onComplete?.();
    };
  }, [src, onComplete]);

  if (children) {
    return <>{children}</>;
  }

  return null;
}

// Resource preloader for fonts, scripts, etc.
interface ResourcePreloaderProps {
  resources: Array<{ type: "font" | "script" | "style"; href: string }>;
}

export function ResourcePreloader({ resources }: ResourcePreloaderProps) {
  React.useEffect(() => {
    resources.forEach((resource) => {
      if (resource.type === "font") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "font";
        link.href = resource.href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      } else if (resource.type === "script") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "script";
        link.href = resource.href;
        document.head.appendChild(link);
      } else if (resource.type === "style") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "style";
        link.href = resource.href;
        document.head.appendChild(link);
      }
    });
  }, [resources]);

  return null;
}

// Smart preloader component with progress indicator
interface SmartPreloaderProps {
  isLoading: boolean;
  progress?: number;
  onComplete?: () => void;
  minDuration?: number;
}

export function SmartPreloader({
  isLoading,
  progress = 0,
  onComplete,
  minDuration = 500,
}: SmartPreloaderProps) {
  const [showLoader, setShowLoader] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setElapsed(0);
      const interval = setInterval(() => {
        setElapsed((prev) => prev + 100);
      }, 100);
      return () => clearInterval(interval);
    } else if (elapsed >= minDuration) {
      setShowLoader(false);
      onComplete?.();
    }
  }, [isLoading, elapsed, minDuration, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background z-50 flex items-center justify-center"
        >
          <div className="text-center space-y-6">
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 border-4 border-primary/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            {progress > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-text-muted">
                  {Math.round(progress)}%
                </div>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Lazy load component with fallback
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function LazyLoad({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "0px",
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Suspense boundary with loading state
interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseBoundary({
  children,
  fallback,
}: SuspenseBoundaryProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <React.Suspense fallback={fallback || defaultFallback}>
      {children}
    </React.Suspense>
  );
}

// Progressive image loading
interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  placeholder,
  alt,
  className,
  priority = false,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          !isLoaded && "opacity-0"
        )}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}

// Critical CSS inliner for performance
export function CriticalCSS({ css }: { css: string }) {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [css]);

  return null;
}

// Prefetch links for next routes
interface PrefetchLinksProps {
  links: string[];
}

export function PrefetchLinks({ links }: PrefetchLinksProps) {
  const { prefetchRoute } = useRoutePreloader();

  React.useEffect(() => {
    links.forEach((link) => {
      prefetchRoute(link);
    });
  }, [links, prefetchRoute]);

  return null;
}

// Connection-aware preloading
export function useConnectionAwarePreloading() {
  const [connectionInfo, setConnectionInfo] = React.useState({
    effectiveType: "4g",
    saveData: false,
  });

  React.useEffect(() => {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      setConnectionInfo({
        effectiveType: connection.effectiveType || "4g",
        saveData: connection.saveData || false,
      });

      const updateConnection = () => {
        setConnectionInfo({
          effectiveType: connection.effectiveType || "4g",
          saveData: connection.saveData || false,
        });
      };

      connection.addEventListener("change", updateConnection);
      return () => {
        connection.removeEventListener("change", updateConnection);
      };
    }
  }, []);

  const shouldPreload = React.useMemo(() => {
    // Don't preload on slow connections or data saver mode
    return (
      !connectionInfo.saveData &&
      (connectionInfo.effectiveType === "4g" ||
        connectionInfo.effectiveType === "3g")
    );
  }, [connectionInfo]);

  return { shouldPreload, connectionInfo };
}
