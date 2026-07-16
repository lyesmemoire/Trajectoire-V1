// @ts-nocheck
"use client";

import * as React from "react";

// Memo wrapper for expensive components
export function memoize<P extends object>(
  Component: React.ComponentType<P>,
  arePropsEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return React.memo(Component, arePropsEqual);
}

// Custom comparison functions
export const propsComparators = {
  // Compare only specific props
  byProps: <P extends object>(propNames: (keyof P)[]) => {
    return (prevProps: P, nextProps: P) => {
      return propNames.every(
        (propName) => prevProps[propName] === nextProps[propName]
      );
    };
  },

  // Deep comparison for objects
  deepEqual: <P extends object>(prevProps: P, nextProps: P) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  },

  // Shallow comparison
  shallowEqual: <P extends object>(prevProps: P, nextProps: P) => {
    const prevKeys = Object.keys(prevProps) as (keyof P)[];
    const nextKeys = Object.keys(nextProps) as (keyof P)[];

    if (prevKeys.length !== nextKeys.length) return false;

    return prevKeys.every((key) => prevProps[key] === nextProps[key]);
  },
};

// Memoized component factory
export function createMemoizedComponent<P extends object>(
  displayName: string,
  comparisonType?: "shallow" | "deep" | "custom" | keyof P,
  customProps?: (keyof P)[]
) {
  return function <T extends React.ComponentType<P>>(
    Component: T,
    arePropsEqual?: (prevProps: P, nextProps: P) => boolean
  ) {
    const MemoizedComponent = React.memo(Component, arePropsEqual);
    MemoizedComponent.displayName = `Memoized(${displayName})`;
    return MemoizedComponent;
  };
}

// Use memoized callback with dependencies
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = React.useRef(callback);
  const depsRef = React.useRef(deps);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => {
    depsRef.current = deps;
  }, deps);

  return React.useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// Use memoized value with deep comparison
export function useDeepMemo<T>(value: T, deps: React.DependencyList): T {
  const ref = React.useRef<{ value: T; deps: React.DependencyList }>({
    value,
    deps,
  });

  const isSame = React.useMemo(() => {
    return JSON.stringify(deps) === JSON.stringify(ref.current.deps);
  }, [deps]);

  if (!isSame) {
    ref.current = { value, deps };
  }

  return ref.current.value;
}

// Use memoized value with shallow comparison
export function useShallowMemo<T>(value: T, deps: React.DependencyList): T {
  const ref = React.useRef<{ value: T; deps: React.DependencyList }>({
    value,
    deps,
  });

  const isSame = React.useMemo(() => {
    if (deps.length !== ref.current.deps.length) return false;
    return deps.every((dep, i) => dep === ref.current.deps[i]);
  }, [deps]);

  if (!isSame) {
    ref.current = { value, deps };
  }

  return ref.current.value;
}

// Memoized list item component
export function MemoizedListItem<T>({
  item,
  renderItem,
  areEqual,
}: {
  item: T;
  renderItem: (item: T) => React.ReactNode;
  areEqual?: (prevItem: T, nextItem: T) => boolean;
}) {
  const MemoizedItem = React.memo(
    ({ item }: { item: T }) => <>{renderItem(item)}</>,
    areEqual ? (prev, next) => areEqual(prev.item, next.item) : undefined
  );

  return <MemoizedItem item={item} />;
}

// Memoized list component
export function MemoizedList<T>({
  items,
  renderItem,
  keyExtractor,
  areEqual,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  areEqual?: (prevItem: T, nextItem: T) => boolean;
}) {
  return (
    <>
      {items.map((item, index) => (
        <MemoizedListItem
          key={keyExtractor(item, index)}
          item={item}
          renderItem={(item) => renderItem(item, index)}
          areEqual={areEqual}
        />
      ))}
    </>
  );
}

// Prevent re-render on parent update
export function StableComponent({ children }: { children: React.ReactNode }) {
  return React.memo(function StableComponent({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  });
}

// Memoized value with custom comparison
export function useCustomMemo<T>(
  factory: () => T,
  isEqual: (prev: T, next: T) => boolean
): T {
  const ref = React.useRef<T | undefined>(undefined);
  const value = factory();

  if (ref.current === undefined || !isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

// Debounced memo
export function useDebouncedMemo<T>(
  value: T,
  delay: number,
  deps: React.DependencyList
): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, ...deps]);

  return debouncedValue;
}

// Throttled memo
export function useThrottledMemo<T>(
  value: T,
  delay: number,
  deps: React.DependencyList
): T {
  const lastRun = React.useRef(Date.now());
  const [throttledValue, setThrottledValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, delay - (Date.now() - lastRun.current));

    return () => clearTimeout(handler);
  }, [value, delay, ...deps]);

  return throttledValue;
}
