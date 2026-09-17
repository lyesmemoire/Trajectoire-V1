import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-muted",
        className,
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}
