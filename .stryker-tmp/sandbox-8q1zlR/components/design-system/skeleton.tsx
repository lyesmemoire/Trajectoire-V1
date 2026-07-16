// @ts-nocheck
import * as React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "default",
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200 rounded";
  
  const variantStyles = {
    default: "h-4 w-full",
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const style = {
    width: width || (variant === "circular" ? "40px" : undefined),
    height: height || (variant === "circular" ? "40px" : undefined),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-xl space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="space-y-2 pt-4">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-xl space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="40%" />
      </div>
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="text" width="50%" />
    </div>
  );
}
