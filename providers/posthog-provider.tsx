"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect } from "react";
import { envClient } from "@/lib/env.client";

export function PostHogProviderWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = envClient.NEXT_PUBLIC_POSTHOG_KEY;

    if (!key) {
      console.warn("PostHog disabled: missing NEXT_PUBLIC_POSTHOG_KEY");
      return;
    }

    posthog.init(key, {
      api_host:
        envClient.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",

      capture_pageview: true,
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
