"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false }
);

export function LazyToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: { fontFamily: "var(--font-inter)" },
      }}
    />
  );
}
