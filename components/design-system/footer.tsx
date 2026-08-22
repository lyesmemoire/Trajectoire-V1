"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  columns?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  bottomLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ icon: LucideIcon; href: string; label: string }>;
}

export function Footer({ 
  className, 
  logo, 
  columns = [], 
  bottomLinks = [], 
  socialLinks = [],
  ...props 
}: FooterProps) {
  return (
    <footer className={cn("border-t border-gray-200 bg-white", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo Column */}
          <div className="space-y-4">
            {logo && <div>{logo}</div>}
          </div>

          {/* Link Columns */}
          {columns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Bottom Links */}
          <div className="flex flex-wrap gap-4">
            {bottomLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center md:text-left">
          <p className="text-sm text-gray-500">
            ┬® {new Date().getFullYear()} Trajectoire. Tous droits r├®serv├®s.
          </p>
        </div>
      </div>
    </footer>
  );
}

export interface FooterColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

export function FooterColumn({ title, className, children, ...props }: FooterColumnProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

export interface FooterLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function FooterLink({ href, className, children, ...props }: FooterLinkProps) {
  return (
    <a
      href={href}
      className={cn("text-sm text-gray-600 hover:text-gray-900 transition-colors", className)}
      {...props}
    >
      {children}
    </a>
  );
}
