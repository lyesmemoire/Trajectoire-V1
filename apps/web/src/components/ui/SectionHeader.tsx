import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "primary" | "accent" | "success" | "warning" | "neutral" | "inverse";
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  inverse?: boolean;
}

export function SectionHeader({
  badge,
  badgeVariant = "primary",
  title,
  description,
  align = "center",
  className,
  inverse = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center mx-auto" : "items-start",
        className
      )}
    >
      {badge && (
        <Badge variant={badgeVariant} uppercase>
          {badge}
        </Badge>
      )}

      <h2
        className={cn(
          "text-display-2 text-balance",
          inverse ? "text-white" : "text-ink",
          align === "center" && "max-w-4xl"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-body-lg",
            inverse ? "text-white/75" : "text-ink-muted",
            align === "center" && "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
