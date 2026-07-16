// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const sidebarVariants = cva(
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        active: "bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarHeader({ className, children, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("p-6 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}

export interface SidebarLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
}

export function SidebarLogo({ href = "/", className, children, ...props }: SidebarLogoProps) {
  return (
    <a
      href={href}
      className={cn("flex items-center gap-2 text-xl font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </a>
  );
}

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
      {children}
    </div>
  );
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, className, children, ...props }: SidebarSectionProps) {
  return (
    <div className={cn("mb-6", className)} {...props}>
      {title && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export interface SidebarLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: LucideIcon;
  active?: boolean;
  children: React.ReactNode;
}

export function SidebarLink({ href, icon: Icon, active, className, children, ...props }: SidebarLinkProps) {
  return (
    <a
      href={href}
      className={cn(sidebarVariants({ variant: active ? "active" : "default" }), className)}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <Slot>{children}</Slot>
    </a>
  );
}

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarFooter({ className, children, ...props }: SidebarFooterProps) {
  return (
    <div className={cn("p-4 border-t border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}
