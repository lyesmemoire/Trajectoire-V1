// Performance optimization components and utilities

// Image optimization
export {
  OptimizedImage,
  ResponsiveImage,
  BackgroundImage,
  AvatarImage,
} from "./optimized-image";

// Dynamic imports and code splitting
export {
  withDynamicImport,
  LazyLoadComponent,
  PrefetchOnHover as PrefetchOnHoverDynamic,
  useCodeSplit,
} from "./dynamic-imports";

// React memo and optimization
export {
  memoize,
  propsComparators,
  createMemoizedComponent,
  useStableCallback,
  useDeepMemo,
  useShallowMemo,
  MemoizedListItem,
  MemoizedList,
  StableComponent,
  useCustomMemo,
  useDebouncedMemo,
  useThrottledMemo,
} from "./react-memo";

// Font optimization
export {
  useFontPreload,
  withFontDisplay,
  getCriticalFontCSS,
  useFontSubsets,
  useFontLoadingObserver,
  FontSwap,
  useVariableFont,
  useFontLoadingState,
  systemFontStack,
  monospaceFontStack,
  useResponsiveFontSize,
  useFontOptimization,
} from "./font-optimization";

// CLS optimization
export {
  ReserveSpace,
  AspectRatioContainer,
  CLSSkeleton,
  CLSOptimizedImage,
  CLSOptimizedFont,
  AdPlaceholder,
  CLSOptimizedVideo,
  CLSOptimizedIframe,
  DynamicContent,
  useCLSMonitor,
  CLSWarning,
  useContentVisibility,
  DynamicHeightReserve,
  useFontCLSPrevention,
} from "./cls-optimization";

// LCP optimization
export {
  preloadResource,
  preloadImage,
  preloadScript,
  preloadStyle,
  PriorityHints,
  CriticalImage,
  LCPElement,
  AboveTheFold,
  CriticalCSS,
  useLCPMonitor,
  LCPWarning,
  prioritizeCriticalContent,
  ServerPushHint,
  EarlyHints,
  useResourceTiming,
  useSlowResourceDetection,
  removeRenderBlockingResources,
  CriticalPath,
  optimizeLCPElement,
  preconnectOrigins,
  dnsPrefetch,
} from "./lcp-optimization";

// Cache and prefetch
export {
  registerServiceWorker,
  CacheManager,
  usePrefetch,
  PrefetchOnHover,
  PrefetchOnViewport,
  useIntelligentPrefetch,
  useCacheFirst,
  useNetworkFirst,
  useStaleWhileRevalidate,
  invalidateCache,
  clearCache,
  prefetchRoutes,
  useViewportPrefetch,
  warmCache,
  useCacheSize,
  handleCacheQuotaExceeded,
} from "./cache-prefetch";

// Render optimization
export {
  VirtualList,
  useDebounce,
  useThrottle,
  useRenderCount,
  useWhyDidYouUpdate,
  StaticChildren,
  useExpensiveCalculation,
  useBatchUpdates,
  useOptimizedEventHandler,
  useContextSelector,
  createOptimizedContext,
  useStableKeys,
  useOptimizedScroll,
  useOptimizedResize,
  useOptimizedAnimation,
  PreventRerender,
  useOptimizedForm,
  useOptimizedSearch,
} from "./render-optimization";
