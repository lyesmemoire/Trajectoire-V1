"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: string[],
  onSelect: (item: string) => void,
  onClose?: () => void
) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
        e.preventDefault();
        if (items[selectedIndex]) {
          onSelect(items[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose?.();
        break;
    }
  };

  return { selectedIndex, handleKeyDown, setSelectedIndex };
}

// Focus trap for modals/dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTab);
    };
  }, [isActive]);

  return containerRef;
}

// Skip to main content link for accessibility
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-medium"
    >
      Aller au contenu principal
    </a>
  );
}

// Accessible button with keyboard support
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function AccessibleButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: AccessibleButtonProps) {
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-200 text-text hover:bg-gray-300",
    ghost: "bg-transparent text-text hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Keyboard shortcut indicator
interface KeyboardShortcutProps {
  shortcut: string[];
  className?: string;
}

export function KeyboardShortcut({ shortcut, className }: KeyboardShortcutProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {shortcut.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-text-muted text-xs">+</span>}
          <kbd className="px-2 py-1 text-xs font-medium text-text-muted bg-gray-100 rounded border border-gray-200">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
}

// Command palette style keyboard navigation
interface CommandPaletteProps {
  items: Array<{ id: string; label: string; description?: string }>;
  onSelect: (item: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function CommandPalette({
  items,
  onSelect,
  onClose,
  isOpen,
}: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap(isOpen);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].id);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      ref={focusTrapRef as React.RefObject<HTMLDivElement>}
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="bg-surface rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              Aucun r├®sultat trouv├®
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors",
                  index === selectedIndex && "bg-gray-100"
                )}
              >
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-sm text-text-muted">{item.description}</div>
                )}
              </button>
            ))
          )}
        </div>
        <div className="p-4 border-t flex justify-between items-center text-sm text-text-muted">
          <div className="flex items-center gap-4">
            <KeyboardShortcut shortcut={["Ôåæ", "Ôåô"]} />
            <span>Naviguer</span>
          </div>
          <div className="flex items-center gap-4">
            <KeyboardShortcut shortcut={["Enter"]} />
            <span>S├®lectionner</span>
          </div>
          <div className="flex items-center gap-4">
            <KeyboardShortcut shortcut={["Esc"]} />
            <span>Fermer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Live region for screen readers
interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive" | "off";
}

export function LiveRegion({ message, politeness = "polite" }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Focus visible indicator
export function FocusIndicator() {
  return (
    <style jsx global>{`
      *:focus-visible {
        outline: 2px solid #1E40AF;
        outline-offset: 2px;
      }
      *:focus:not(:focus-visible) {
        outline: none;
      }
    `}</style>
  );
}

// Accessible card with keyboard navigation
interface AccessibleCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tabIndex?: number;
}

export function AccessibleCard({
  children,
  onClick,
  className,
  tabIndex = 0,
}: AccessibleCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="button"
      aria-label="Carte interactive"
    >
      {children}
    </div>
  );
}

// Accessible menu with keyboard navigation
interface AccessibleMenuProps {
  items: Array<{ id: string; label: string; onClick: () => void }>;
  trigger: React.ReactNode;
}

export function AccessibleMenu({ items, trigger }: AccessibleMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
        e.preventDefault();
        items[selectedIndex]?.onClick();
        setIsOpen(false);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border py-2 z-50"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                index === selectedIndex && "bg-gray-100"
              )}
              role="menuitem"
              tabIndex={index === 0 ? 0 : -1}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
