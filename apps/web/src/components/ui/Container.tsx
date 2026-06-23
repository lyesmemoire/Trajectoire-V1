import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "default" | "narrow" | "prose" | "full";

const SIZE_STYLES: Record<ContainerSize, string> = {
  default: "max-w-container",
  narrow: "max-w-container-narrow",
  prose: "max-w-container-prose",
  full: "max-w-none",
};

interface ContainerProps {
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

export function Container({
  size = "default",
  className,
  children,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6 sm:px-8 lg:px-12",
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </div>
  );
}
