"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader } from "@/components/design-system";

// Dynamic imports for heavy components (uncomment when components exist)
/*
export const DynamicChart = dynamic(
  () => import("@/components/charts/chart").then((mod) => mod.Chart),
  {
    loading: () => <Loader variant="dots" />,
    ssr: false,
  }
);

export const DynamicMap = dynamic(
  () => import("@/components/map/map").then((mod) => mod.Map),
  {
    loading: () => <Loader variant="dots" />,
    ssr: false,
  }
);

export const DynamicEditor = dynamic(
  () => import("@/components/editor/editor").then((mod) => mod.Editor),
  {
    loading: () => <Loader variant="dots" />,
    ssr: false,
  }
);

export const DynamicPDFViewer = dynamic(
  () => import("@/components/pdf/viewer").then((mod) => mod.PDFViewer),
  {
    loading: () => <Loader variant="dots" />,
    ssr: false,
  }
);
*/

// Dynamic import with suspense wrapper
export function withDynamicImport<P extends object>(
  componentPath: string,
  componentName: string
) {
  const Component = dynamic(
    () => import(`@/components/${componentPath}`).then((mod) => (mod as any)[componentName]),
    {
      loading: () => <Loader variant="dots" />,
      ssr: false,
    }
  );

  return function DynamicWrapper(props: P) {
    return (
      <Suspense fallback={<Loader variant="dots" />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Route-based dynamic imports (commented out - use in layout.tsx when needed)
/*
export const DynamicDashboard = dynamic(
  () => import("@/app/dashboard/page"),
  {
    loading: () => <Loader variant="dots" size="lg" text="Chargement du dashboard..." />,
  }
);

export const DynamicCVs = dynamic(
  () => import("@/app/dashboard/cvs/page"),
  {
    loading: () => <Loader variant="dots" size="lg" text="Chargement des CVs..." />,
  }
);

export const DynamicATS = dynamic(
  () => import("@/app/dashboard/ats/page"),
  {
    loading: () => <Loader variant="dots" size="lg" text="Chargement de l'analyseur ATS..." />,
  }
);

export const DynamicBilling = dynamic(
  () => import("@/app/dashboard/billing/page"),
  {
    loading: () => <Loader variant="dots" size="lg" text="Chargement de la facturation..." />,
  }
);

export const DynamicOptimize = dynamic(
  () => import("@/app/dashboard/optimize/page"),
  {
    loading: () => <Loader variant="dots" size="lg" text="Chargement de l'optimiseur..." />,
  }
);
*/

// Lazy load components with intersection observer
export function LazyLoadComponent<P extends object>({
  component,
  fallback,
  threshold = 0.1,
  ...props
}: {
  component: React.ComponentType<P>;
  fallback?: React.ReactNode;
  threshold?: number;
} & P) {
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
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const Component = component;

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback || <Loader variant="dots" />}>
          <Component {...(props as P)} />
        </Suspense>
      ) : (
        fallback || <Loader variant="dots" />
      )}
    </div>
  );
}

// Prefetch component on hover
export function PrefetchOnHover<P extends object>({
  component,
  prefetchPath,
  children,
  ...props
}: {
  component: React.ComponentType<P>;
  prefetchPath: string;
  children: React.ReactNode;
} & P) {
  const router = React.useMemo(() => require("next/router").useRouter(), []);
  const Component = component;

  const handleMouseEnter = () => {
    router.prefetch(prefetchPath);
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Component {...(props as P)}>{children}</Component>
    </div>
  );
}

// Code split by route
export function useCodeSplit() {
  const loadModule = React.useCallback((path: string) => {
    return dynamic(() => import(path).catch((error) => {
      console.error(`Failed to load module: ${path}`, error);
      return () => <div>Error loading module</div>;
    }));
  }, []);

  return { loadModule };
}
