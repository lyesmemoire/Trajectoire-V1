import { ReactNode } from "react";
import { MotionProvider } from "@/components/providers/motion-provider";
import { LazyToaster } from "@/components/providers/lazy-toaster";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      {children}
      <LazyToaster />
    </MotionProvider>
  );
}
