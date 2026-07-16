// @ts-nocheck
"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      loading={priority ? "eager" : "lazy"}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// Responsive image with multiple breakpoints
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
}

export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = "auto",
}: ResponsiveImageProps) {
  const aspectRatios = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "",
  };

  return (
    <div className={cn("relative w-full", aspectRatios[aspectRatio])}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}

// Background image with lazy loading
interface BackgroundImageProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}

export function BackgroundImage({
  src,
  className,
  children,
  overlay = true,
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <OptimizedImage
        src={src}
        alt=""
        fill
        className={cn("object-cover", !isLoaded && "opacity-0")}
        onLoad={() => setIsLoaded(true)}
        priority={true}
        sizes="100vw"
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}

// Avatar image with fallback
interface AvatarImageProps {
  src?: string;
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const sizePx = sizes[size];

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "rounded-full bg-gray-200 flex items-center justify-center text-text-muted font-medium",
          className
        )}
        style={{ width: sizePx, height: sizePx }}
      >
        {fallback?.charAt(0).toUpperCase() || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("rounded-full overflow-hidden", className)} style={{ width: sizePx, height: sizePx }}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={sizePx}
        height={sizePx}
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
