// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// WCAG AA compliance checker and utilities

// Color contrast checker
export function checkContrastRatio(
  foreground: string,
  background: string
): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((value) => {
      if (value === undefined) return 0;
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * (r || 0) + 0.7152 * (g || 0) + 0.0722 * (b || 0);
  };

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return [
      parseInt(result[1] || "00", 16),
      parseInt(result[2] || "00", 16),
      parseInt(result[3] || "00", 16),
    ];
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}

// ARIA attribute validator
interface AriaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateAriaAttributes(element: HTMLElement): AriaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required ARIA attributes on interactive elements
  const role = element.getAttribute("role");
  const tagName = element.tagName.toLowerCase();

  if (role === "button" && tagName !== "button") {
    if (!element.getAttribute("aria-label") && !element.getAttribute("aria-labelledby")) {
      errors.push("Button role requires aria-label or aria-labelledby");
    }
  }

  if (role === "img" && !element.getAttribute("aria-label")) {
    errors.push("Image role requires aria-label");
  }

  if (element.hasAttribute("aria-expanded") && !role) {
    warnings.push("aria-expanded should be used with a role attribute");
  }

  // Check for invalid ARIA attributes
  const invalidAria = Array.from(element.attributes).filter((attr) =>
    attr.name.startsWith("aria-")
  );

  const validAriaAttributes = [
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-hidden",
    "aria-expanded",
    "aria-pressed",
    "aria-checked",
    "aria-disabled",
    "aria-live",
    "aria-atomic",
    "aria-relevant",
    "aria-busy",
  ];

  invalidAria.forEach((attr) => {
    if (!validAriaAttributes.includes(attr.name)) {
      warnings.push(`Potentially invalid ARIA attribute: ${attr.name}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Focus management utilities
export function manageFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  return {
    firstElement,
    lastElement,
    focusFirst: () => firstElement?.focus(),
    focusLast: () => lastElement?.focus(),
  };
}

// Screen reader announcement
export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", politeness);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Skip links generator
export function generateSkipLinks(links: Array<{ href: string; label: string }>) {
  return links.map((link) => (
    <a
      key={link.href}
      href={link.href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-medium"
    >
      {link.label}
    </a>
  ));
}

// Landmark region validator
export function validateLandmarks(): {
  hasHeader: boolean;
  hasMain: boolean;
  hasNav: boolean;
  hasFooter: boolean;
  missing: string[];
} {
  const hasHeader = !!document.querySelector("header, [role='banner']");
  const hasMain = !!document.querySelector("main, [role='main']");
  const hasNav = !!document.querySelector("nav, [role='navigation']");
  const hasFooter = !!document.querySelector("footer, [role='contentinfo']");

  const missing: string[] = [];
  if (!hasHeader) missing.push("header/banner");
  if (!hasMain) missing.push("main");
  if (!hasNav) missing.push("nav/navigation");
  if (!hasFooter) missing.push("footer/contentinfo");

  return {
    hasHeader,
    hasMain,
    hasNav,
    hasFooter,
    missing,
  };
}

// Heading structure validator
export function validateHeadingStructure(): {
  hasH1: boolean;
  skippedLevels: number[];
  correctOrder: boolean;
} {
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  const hasH1 = headings.some((h) => h.tagName.toLowerCase() === "h1");

  const skippedLevels: number[] = [];
  let previousLevel = 0;

  headings.forEach((heading) => {
    const tagChar = heading.tagName[1];
    if (!tagChar) return;
    const level = parseInt(tagChar);
    if (level > previousLevel + 1) {
      skippedLevels.push(level);
    }
    previousLevel = level;
  });

  return {
    hasH1,
    skippedLevels,
    correctOrder: skippedLevels.length === 0,
  };
}

// Form accessibility validator
export function validateFormAccessibility(form: HTMLFormElement): {
  hasLabels: boolean;
  hasAriaRequired: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const inputs = form.querySelectorAll("input, select, textarea");
  let hasLabels = true;
  let hasAriaRequired = true;

  inputs.forEach((input) => {
    const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const id = element.id;
    const label = id ? document.querySelector(`label[for="${id}"]`) : null;
    const ariaLabel = element.getAttribute("aria-label");
    const ariaLabelledby = element.getAttribute("aria-labelledby");
    const required = element.required;
    const ariaRequired = element.getAttribute("aria-required");

    if (!label && !ariaLabel && !ariaLabelledby) {
      hasLabels = false;
      errors.push(`Input ${id || "without ID"} missing label`);
    }

    if (required && ariaRequired !== "true") {
      hasAriaRequired = false;
    }
  });

  return {
    hasLabels,
    hasAriaRequired,
    errors,
  };
}

// Alt text validator for images
export function validateImageAlts(): {
  total: number;
  withAlt: number;
  withoutAlt: number;
  decorative: number;
  missing: string[];
} {
  const images = Array.from(document.querySelectorAll("img"));
  const missing: string[] = [];
  let withAlt = 0;
  let withoutAlt = 0;
  let decorative = 0;

  images.forEach((img) => {
    const alt = img.getAttribute("alt");
    const role = img.getAttribute("role");
    const src = img.getAttribute("src");

    if (role === "presentation" || alt === "") {
      decorative++;
    } else if (alt) {
      withAlt++;
    } else {
      withoutAlt++;
      missing.push(src || "image without src");
    }
  });

  return {
    total: images.length,
    withAlt,
    withoutAlt,
    decorative,
    missing,
  };
}

// WCAG compliance report component
interface WCAGReportProps {
  showDetails?: boolean;
}

export function WCAGReport({ showDetails = false }: WCAGReportProps) {
  const [report, setReport] = React.useState<any>(null);

  React.useEffect(() => {
    const landmarks = validateLandmarks();
    const headings = validateHeadingStructure();
    const images = validateImageAlts();

    setReport({
      landmarks,
      headings,
      images,
      overall: {
        score: calculateOverallScore(landmarks, headings, images),
        issues: [
          ...landmarks.missing.map((m) => `Missing landmark: ${m}`),
          ...headings.skippedLevels.map((l) => `Skipped heading level: ${l}`),
          ...images.missing.map((m) => `Missing alt text: ${m}`),
        ],
      },
    });
  }, []);

  if (!report) return null;

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">WCAG AA Compliance Report</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Overall Score</span>
          <span
            className={cn(
              "font-semibold",
              report.overall.score >= 80
                ? "text-success"
                : report.overall.score >= 60
                ? "text-warning"
                : "text-error"
            )}
          >
            {report.overall.score}%
          </span>
        </div>

        {showDetails && (
          <>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Landmarks</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Header</span>
                  <span className={report.landmarks.hasHeader ? "text-success" : "text-error"}>
                    {report.landmarks.hasHeader ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Main</span>
                  <span className={report.landmarks.hasMain ? "text-success" : "text-error"}>
                    {report.landmarks.hasMain ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Navigation</span>
                  <span className={report.landmarks.hasNav ? "text-success" : "text-error"}>
                    {report.landmarks.hasNav ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Footer</span>
                  <span className={report.landmarks.hasFooter ? "text-success" : "text-error"}>
                    {report.landmarks.hasFooter ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Headings</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Has H1</span>
                  <span className={report.headings.hasH1 ? "text-success" : "text-error"}>
                    {report.headings.hasH1 ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Correct Order</span>
                  <span className={report.headings.correctOrder ? "text-success" : "text-error"}>
                    {report.headings.correctOrder ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Images</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{report.images.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Alt</span>
                  <span className="text-success">{report.images.withAlt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Missing Alt</span>
                  <span className={report.images.withoutAlt > 0 ? "text-error" : "text-success"}>
                    {report.images.withoutAlt}
                  </span>
                </div>
              </div>
            </div>

            {report.overall.issues.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Issues</h4>
                <ul className="space-y-1 text-sm text-error">
                  {report.overall.issues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function calculateOverallScore(landmarks: any, headings: any, images: any): number {
  let score = 100;

  // Landmarks (25%)
  if (!landmarks.hasHeader) score -= 6.25;
  if (!landmarks.hasMain) score -= 6.25;
  if (!landmarks.hasNav) score -= 6.25;
  if (!landmarks.hasFooter) score -= 6.25;

  // Headings (25%)
  if (!headings.hasH1) score -= 12.5;
  if (!headings.correctOrder) score -= 12.5;

  // Images (50%)
  if (images.total > 0) {
    const altPercentage = (images.withAlt / images.total) * 100;
    score -= (100 - altPercentage) * 0.5;
  }

  return Math.max(0, Math.round(score));
}
