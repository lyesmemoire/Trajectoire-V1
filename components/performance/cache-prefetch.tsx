"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// Cache utilities

// Service Worker registration for offline support
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("SW registered: ", registration);
        },
        (registrationError) => {
          console.log("SW registration failed: ", registrationError);
        }
      );
    });
  }
}

// Cache API wrapper
export class CacheManager {
  private cacheName: string;

  constructor(cacheName: string) {
    this.cacheName = cacheName;
  }

  async put(request: RequestInfo, response: Response) {
    const cache = await caches.open(this.cacheName);
    await cache.put(request, response);
  }

  async get(request: RequestInfo): Promise<Response | undefined> {
    const cache = await caches.open(this.cacheName);
    return await cache.match(request);
  }

  async delete(request: RequestInfo) {
    const cache = await caches.open(this.cacheName);
    await cache.delete(request);
  }

  async clear() {
    const cache = await caches.open(this.cacheName);
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
  }
}

// Prefetch hook for Next.js routes
export function usePrefetch() {
  const router = useRouter();

  const prefetchRoute = React.useCallback(
    (path: string) => {
      router.prefetch(path);
    },
    [router]
  );

  return { prefetchRoute };
}

// Prefetch on hover
export function PrefetchOnHover({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { prefetchRoute } = usePrefetch();

  return (
    <a
      href={href}
      onMouseEnter={() => prefetchRoute(href)}
      onFocus={() => prefetchRoute(href)}
    >
      {children}
    </a>
  );
}

// Prefetch on viewport entry
export function PrefetchOnViewport({
  href,
  threshold = 0.5,
  children,
}: {
  href: string;
  threshold?: number;
  children: React.ReactNode;
}) {
  const { prefetchRoute } = usePrefetch();
  const [hasPrefetched, setHasPrefetched] = React.useState(false);
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (hasPrefetched) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasPrefetched) {
          prefetchRoute(href);
          setHasPrefetched(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [href, threshold, hasPrefetched, prefetchRoute]);

  return (
    <a ref={ref} href={href}>
      {children}
    </a>
  );
}

// Intelligent prefetch based on user behavior
export function useIntelligentPrefetch() {
  const [visitedRoutes, setVisitedRoutes] = React.useState<Set<string>>(new Set());
  const router = useRouter();

  const trackVisit = React.useCallback((path: string) => {
    setVisitedRoutes((prev) => new Set(prev).add(path));
  }, []);

  const prefetchLikelyRoutes = React.useCallback(() => {
    // Prefetch routes based on visited patterns
    const routes = Array.from(visitedRoutes);
    routes.forEach((route) => {
      router.prefetch(route);
    });
  }, [visitedRoutes, router]);

  return { trackVisit, prefetchLikelyRoutes };
}

// Cache-first data fetching
export function useCacheFirst<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
  }
) {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const ttl = options?.ttl || 5 * 60 * 1000; // 5 minutes default

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > ttl;

          if (!isExpired) {
            setData(cachedData);
            setIsLoading(false);

            if (options?.staleWhileRevalidate) {
              // Revalidate in background
              fetcher().then((freshData) => {
                setData(freshData);
                localStorage.setItem(
                  key,
                  JSON.stringify({ data: freshData, timestamp: Date.now() })
                );
              });
            }
            return;
          }
        }

        // Fetch fresh data
        const freshData = await fetcher();
        setData(freshData);
        localStorage.setItem(
          key,
          JSON.stringify({ data: freshData, timestamp: Date.now() })
        );
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, ttl, options?.staleWhileRevalidate]);

  return { data, isLoading, error };
}

// Network-first data fetching with cache fallback
export function useNetworkFirst<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number }
) {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const ttl = options?.ttl || 5 * 60 * 1000;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Try network first
        const freshData = await fetcher();
        setData(freshData);
        localStorage.setItem(
          key,
          JSON.stringify({ data: freshData, timestamp: Date.now() })
        );
      } catch (err) {
        // Fallback to cache
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > ttl;

          if (!isExpired) {
            setData(cachedData);
          } else {
            setError(err as Error);
          }
        } else {
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, ttl]);

  return { data, isLoading, error };
}

// Stale-while-revalidate data fetching
export function useStaleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number }
) {
  return useCacheFirst(key, fetcher, { ...options, staleWhileRevalidate: true });
}

// Cache invalidation
export function invalidateCache(key: string) {
  localStorage.removeItem(key);
}

// Clear all cache
export function clearCache() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("cache_")) {
      localStorage.removeItem(key);
    }
  });
}

// Prefetch multiple routes
export function prefetchRoutes(routes: string[]) {
  const router = useRouter();

  React.useEffect(() => {
    routes.forEach((route) => {
      router.prefetch(route);
    });
  }, [routes, router]);
}

// Prefetch based on viewport
export function useViewportPrefetch(routes: string[], threshold = 0.3) {
  const [prefetched, setPrefetched] = React.useState<Set<string>>(new Set());
  const router = useRouter();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry) return;
          if (entry.isIntersecting) {
            const href = (entry.target as HTMLAnchorElement).href;
            if (!prefetched.has(href)) {
              router.prefetch(href);
              setPrefetched((prev) => new Set(prev).add(href));
            }
          }
        });
      },
      { threshold }
    );

    const links = document.querySelectorAll(`a[href^="/"]`);
    links.forEach((link) => observer.observe(link));

    return () => observer.disconnect();
  }, [routes, threshold, prefetched, router]);
}

// Cache warming
export function warmCache(keys: string[]) {
  keys.forEach((key) => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes

      if (isExpired) {
        localStorage.removeItem(key);
      }
    }
  });
}

// Cache size monitoring
export function useCacheSize() {
  const [size, setSize] = React.useState(0);

  React.useEffect(() => {
    const calculateSize = () => {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      setSize(total);
    };

    calculateSize();
    const interval = setInterval(calculateSize, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return size;
}

// Cache quota exceeded handler
export function handleCacheQuotaExceeded() {
  if (typeof window !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
    navigator.storage.estimate().then(({ usage, quota }) => {
      const safeUsage = usage ?? 0;
      const safeQuota = quota ?? 1;
      const percentage = (safeUsage / safeQuota) * 100;
      if (percentage > 90) {
        // Clear old cache entries
        clearCache();
      }
    });
  }
}
