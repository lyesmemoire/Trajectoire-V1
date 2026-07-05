"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// LCP (Largest Contentful Paint) optimization utilities

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Preload critical images
export function preloadImage(src: string) {
  preloadResource(src, "image");
}

// Preload critical scripts
export function preloadScript(src: string) {
  preloadResource(src, "script");
}

// Preload critical styles
export function preloadStyle(href: string) {
  preloadResource(href, "style");
}

// Priority hint for critical resources
export function PriorityHints({
  images,
  scripts,
  styles,
}: {
  images?: string[];
  scripts?: string[];
  styles?: string[];
}) {
  React.useEffect(() => {
    images?.forEach(preloadImage);
    scripts?.forEach(preloadScript);
    styles?.forEach(preloadStyle);
  }, [images, scripts, styles]);

  return null;
}

// Critical image with priority loading
export function CriticalImage({
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
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      {...props}
    />
  );
}

// LCP element identifier
export function LCPElement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-lcp="true">
      {children}
    </div>
  );
}

// Above the fold content marker
export function AboveTheFold({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-above-fold="true">
      {children}
    </div>
  );
}

// Critical CSS inliner
export function CriticalCSS({ css }: { css: string }) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const style = document.createElement("style");
    style.textContent = css;
    style.setAttribute("data-critical", "true");
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [css]);

  return null;
}

// LCP monitor (for development)
export function useLCPMonitor() {
  const [lcpValue, setLCPValue] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry && lastEntry.entryType === "largest-contentful-paint") {
        setLCPValue((lastEntry as any).startTime);
      }
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });

    return () => observer.disconnect();
  }, []);

  return lcpValue;
}

// LCP warning component (development only)
export function LCPWarning({ threshold = 2500 }: { threshold?: number }) {
  const lcpValue = useLCPMonitor();

  if (process.env.NODE_ENV !== "development" || lcpValue === null) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50",
        lcpValue > threshold ? "bg-error text-white" : "bg-success text-white"
      )}
    >
      <div className="font-medium">LCP: {Math.round(lcpValue)}ms</div>
      <div className="text-sm opacity-90">
        {lcpValue > threshold ? "Above threshold!" : "Good"}
      </div>
    </div>
  );
}

// Optimize LCP by prioritizing critical content
export function prioritizeCriticalContent() {
  if (typeof document === "undefined") return;

  // Add fetchpriority="high" to critical images
  const criticalImages = document.querySelectorAll('[data-critical="true"] img');
  criticalImages.forEach((img) => {
    (img as HTMLImageElement).fetchPriority = "high";
  });

  // Add loading="eager" to above-fold images
  const aboveFoldImages = document.querySelectorAll('[data-above-fold="true"] img');
  aboveFoldImages.forEach((img) => {
    (img as HTMLImageElement).loading = "eager";
  });
}

// Server push hint (for HTTP/2)
export function ServerPushHint({
  resources,
}: {
  resources: Array<{ href: string; as: string }>;
}) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    resources.forEach(({ href, as }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    });
  }, [resources]);

  return null;
}

// Early Hints (for HTTP/3)
export function EarlyHints({
  resources,
}: {
  resources: Array<{ href: string; as: string }>;
}) {
  // This would typically be handled by the server
  // Client-side fallback using preload
  return <ServerPushHint resources={resources} />;
}

// Resource timing analysis
export function useResourceTiming() {
  const [resources, setResources] = React.useState<PerformanceResourceTiming[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      setResources((prev) => [...prev, ...entries]);
    });

    observer.observe({ type: "resource", buffered: true });

    return () => observer.disconnect();
  }, []);

  return resources;
}

// Slow resource detection
export function useSlowResourceDetection(threshold = 1000) {
  const resources = useResourceTiming();
  const slowResources = React.useMemo(() => {
    return resources.filter((r) => r.duration > threshold);
  }, [resources, threshold]);

  return slowResources;
}

// Optimize LCP by removing render-blocking resources
export function removeRenderBlockingResources() {
  if (typeof document === "undefined") return;

  // Add async to render-blocking scripts
  const blockingScripts = document.querySelectorAll("script[src]:not([async]):not([defer])");
  blockingScripts.forEach((script) => {
    (script as HTMLScriptElement).async = true;
  });

  // Add media to render-blocking stylesheets
  const blockingStyles = document.querySelectorAll("link[rel='stylesheet']:not([media])");
  blockingStyles.forEach((link) => {
    (link as HTMLLinkElement).setAttribute("media", "print");
  });
}

// Critical path optimization
export function CriticalPath({
  children,
  priority = "high",
}: {
  children: React.ReactNode;
  priority?: "high" | "low" | "auto";
}) {
  return (
    <div data-critical-path={priority}>
      {children}
    </div>
  );
}

// LCP element optimizer
export function optimizeLCPElement() {
  if (typeof document === "undefined") return;

  const lcpElement = document.querySelector('[data-lcp="true"]');
  if (!lcpElement) return;

  // Ensure LCP element is in viewport
  const rect = lcpElement.getBoundingClientRect();
  if (rect.top < 0) {
    lcpElement.scrollIntoView({ behavior: "instant", block: "start" });
  }

  // Optimize images within LCP element
  const images = lcpElement.querySelectorAll("img");
  images.forEach((img) => {
    (img as HTMLImageElement).loading = "eager";
    (img as HTMLImageElement).fetchPriority = "high";
    (img as HTMLImageElement).decoding = "sync";
  });
}

// Preconnect to critical origins
export function preconnectOrigins(origins: string[]) {
  if (typeof document === "undefined") return;

  origins.forEach((origin) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    document.head.appendChild(link);
  });
}

// DNS prefetch for external domains
export function dnsPrefetch(domains: string[]) {
  if (typeof document === "undefined") return;

  domains.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = domain;
    document.head.appendChild(link);
  });
}
