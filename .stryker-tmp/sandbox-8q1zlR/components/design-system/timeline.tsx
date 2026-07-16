// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const timelineVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        default: "",
        vertical: "flex flex-col",
        horizontal: "flex flex-row",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof timelineVariants> {
  items: Array<{
    title: string;
    description?: string;
    date?: string;
    icon?: LucideIcon;
    status?: "completed" | "in-progress" | "pending";
  }>;
}

export function Timeline({ variant = "default", items = [], className, ...props }: TimelineProps) {
  const isVertical = variant === "vertical" || variant === "default";

  return (
    <div className={cn(timelineVariants({ variant }), className)} {...props}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title}
          description={item.description}
          date={item.date}
          icon={item.icon}
          status={item.status}
          isLast={index === items.length - 1}
          isVertical={isVertical}
        />
      ))}
    </div>
  );
}

export interface TimelineItemProps {
  title: string;
  description?: string;
  date?: string;
  icon?: LucideIcon;
  status?: "completed" | "in-progress" | "pending";
  isLast?: boolean;
  isVertical?: boolean;
}

export function TimelineItem({
  title,
  description,
  date,
  icon: Icon,
  status = "pending",
  isLast = false,
  isVertical = true,
}: TimelineItemProps) {
  const statusColors = {
    completed: "bg-green-600 border-green-600",
    "in-progress": "bg-blue-600 border-blue-600",
    pending: "bg-gray-300 border-gray-300",
  };

  return (
    <div className={cn("relative", isVertical ? "pb-8" : "pr-8", !isLast && (isVertical ? "border-l-2" : "border-t-2"), "border-gray-200")}>
      {/* Timeline Dot */}
      <div
        className={cn(
          "absolute flex items-center justify-center w-4 h-4 rounded-full border-2",
          statusColors[status],
          isVertical ? "-left-[9px] top-0" : "left-0 -top-[9px]"
        )}
      >
        {Icon && <Icon className="w-2 h-2 text-white" />}
      </div>

      {/* Content */}
      <div className={cn(isVertical ? "pl-6" : "pt-6")}>
        {date && (
          <p className="text-sm text-gray-500 mb-1">{date}</p>
        )}
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "completed" | "in-progress" | "pending";
  icon?: LucideIcon;
}

export function TimelineDot({ status = "pending", icon: Icon, className, ...props }: TimelineDotProps) {
  const statusColors = {
    completed: "bg-green-600 border-green-600",
    "in-progress": "bg-blue-600 border-blue-600",
    pending: "bg-gray-300 border-gray-300",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center w-4 h-4 rounded-full border-2",
        statusColors[status],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-2 h-2 text-white" />}
    </div>
  );
}
