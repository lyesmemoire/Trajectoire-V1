"use client";

import * as React from "react";

// Render optimization utilities

// Virtual list for long lists
export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: "auto" }}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, delay]);

  return throttledValue;
}

// Render count tracker (development only)
export function useRenderCount(componentName: string) {
  if (process.env.NODE_ENV !== "development") {
    return 0;
  }

  const renderCount = React.useRef(0);
  React.useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });

  return renderCount.current;
}

// Why did you render (development only)
export function useWhyDidYouUpdate(
  componentName: string,
  props: Record<string, any>
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const prevProps = React.useRef<Record<string, any> | undefined>(undefined);

  React.useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (prevProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log("[why-did-you-update]", componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
}

// Component that only renders when children change
export function StaticChildren({ children }: { children: React.ReactNode }) {
  return React.memo(
    function StaticChildren({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    },
    (prevProps, nextProps) => {
      return prevProps.children === nextProps.children;
    }
  );
}

// Render optimization for expensive calculations
export function useExpensiveCalculation<T>(
  calculation: () => T,
  deps: React.DependencyList
): T {
  return React.useMemo(calculation, deps);
}

// Batch state updates
export function useBatchUpdates() {
  const [isBatching, setIsBatching] = React.useState(false);
  const batchedUpdates = React.useRef<Array<() => void>>([]);

  const batch = React.useCallback((update: () => void) => {
    if (isBatching) {
      batchedUpdates.current.push(update);
    } else {
      update();
    }
  }, [isBatching]);

  const flush = React.useCallback(() => {
    setIsBatching(true);
    React.startTransition(() => {
      batchedUpdates.current.forEach((update) => update());
      batchedUpdates.current = [];
      setIsBatching(false);
    });
  }, []);

  return { batch, flush };
}

// Optimized event handler
export function useOptimizedEventHandler<T extends (...args: any[]) => any>(
  handler: T,
  delay = 100
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const lastArgs = React.useRef<Parameters<T> | undefined>(undefined);

  return React.useCallback(
    (...args: Parameters<T>) => {
      lastArgs.current = args;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (lastArgs.current) {
          handler(...lastArgs.current);
        }
      }, delay);
    },
    [handler, delay]
  ) as T;
}

// Prevent unnecessary re-renders with context selector
export function useContextSelector<T, U>(
  context: React.Context<T>,
  selector: (value: T) => U
): U {
  const value = React.useContext(context);
  return React.useMemo(() => selector(value), [value, selector]);
}

// Optimized context provider
export function createOptimizedContext<T>(defaultValue: T) {
  const Context = React.createContext(defaultValue);

  function Provider({
    value,
    children,
  }: {
    value: T;
    children: React.ReactNode;
  }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContextSelector<U>(selector: (value: T) => U): U {
    const value = React.useContext(Context);
    return React.useMemo(() => selector(value), [value, selector]);
  }

  return { Provider, useContextSelector };
}

// Render optimization for lists with stable keys
export function useStableKeys<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string
) {
  return React.useMemo(() => {
    return items.map((item, index) => ({
      item,
      key: keyExtractor(item, index),
    }));
  }, [items, keyExtractor]);
}

// Optimized scroll handler
export function useOptimizedScroll(
  handler: (event: Event) => void,
  delay = 16
) {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    const handleScroll = (event: Event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handler(event);
      }, delay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handler, delay]);
}

// Optimized resize handler
export function useOptimizedResize(
  handler: () => void,
  delay = 100
) {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handler();
      }, delay);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handler, delay]);
}

// Render optimization for animations
export function useOptimizedAnimation(
  callback: () => void,
  deps: React.DependencyList
) {
  const requestRef = React.useRef<number | undefined>(undefined);

  const animate = React.useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...deps]);
}

// Component that prevents re-renders from parent
export function PreventRerender({ children }: { children: React.ReactNode }) {
  return React.memo(function PreventRender({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  });
}

// Optimized form handler
export function useOptimizedForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => void
) {
  const [values, setValues] = React.useState(initialValues);
  const [isDirty, setIsDirty] = React.useState(false);

  const handleChange = React.useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);
    },
    []
  );

  const handleSubmit = React.useCallback(() => {
    onSubmit(values);
    setIsDirty(false);
  }, [values, onSubmit]);

  const reset = React.useCallback(() => {
    setValues(initialValues);
    setIsDirty(false);
  }, [initialValues]);

  return { values, handleChange, handleSubmit, reset, isDirty };
}

// Optimized search handler
export function useOptimizedSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay = 300
) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState(items);

  const debouncedQuery = useDebounce(query, delay);

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults(items);
    } else {
      setResults(items.filter((item) => searchFn(item, debouncedQuery)));
    }
  }, [debouncedQuery, items, searchFn]);

  return { query, setQuery, results };
}
