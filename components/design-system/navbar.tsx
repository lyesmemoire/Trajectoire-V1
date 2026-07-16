"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navbarVariants = cva(
  "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/80 backdrop-blur-md border-gray-200",
        transparent: "bg-transparent border-transparent",
        solid: "bg-white border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "transparent" | "solid";
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
  mobileMenu?: React.ReactNode;
}

export function Navbar({ 
  variant = "default", 
  className, 
  logo, 
  navItems = [], 
  actions,
  mobileMenu,
  ...props 
}: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        navbarVariants({ variant }),
        scrolled && "bg-white/95 backdrop-blur-md shadow-sm",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Slot>{logo}</Slot>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {actions}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {mobileMenu}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export interface NavbarLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
}

export function NavbarLogo({ href = "/", className, children, ...props }: NavbarLogoProps) {
  return (
    <a href={href} className={cn("flex items-center gap-2 text-xl font-semibold text-gray-900", className)} {...props}>
      {children}
    </a>
  );
}

export interface NavbarLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

export function NavbarLink({ href, active, className, children, ...props }: NavbarLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        active ? "text-gray-900" : "text-gray-600 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NavbarActions({ className, children, ...props }: NavbarActionsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
}
