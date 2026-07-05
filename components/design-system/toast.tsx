"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    className: "bg-success/10 border-success/20 text-success",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    className: "bg-error/10 border-error/20 text-error",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    className: "bg-warning/10 border-warning/20 text-warning",
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    className: "bg-primary/10 border-primary/20 text-primary",
  },
};

export function Toast({
  id,
  variant = "info",
  title,
  description,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl border shadow-soft min-w-[300px] max-w-md",
            styles.className
          )}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
          <div className="flex-1 space-y-1">
            {title && (
              <p className="font-semibold text-sm">{title}</p>
            )}
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Container for managing multiple toasts
interface ToastContainerProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const positionStyles: Record<
  string,
  { container: string; toast: string }
> = {
  "top-right": {
    container: "top-4 right-4",
    toast: "flex-col-reverse",
  },
  "top-left": {
    container: "top-4 left-4",
    toast: "flex-col-reverse",
  },
  "bottom-right": {
    container: "bottom-4 right-4",
    toast: "flex-col",
  },
  "bottom-left": {
    container: "bottom-4 left-4",
    toast: "flex-col",
  },
};

const defaultPositionStyles = {
  container: "top-4 right-4",
  toast: "flex-col-reverse",
};

export function ToastContainer({
  children,
  position = "top-right",
}: ToastContainerProps) {
  const styles = positionStyles[position] || defaultPositionStyles;

  return (
    <div
      className={cn(
        "fixed z-50 flex gap-2 pointer-events-none",
        styles.container,
        styles.toast
      )}
    >
      {React.Children.map(children, (child) => (
        <div className="pointer-events-auto">{child}</div>
      ))}
    </div>
  );
}

// Toast Context for easy usage
interface ToastContextValue {
  toast: (props: Omit<ToastProps, "id" | "duration">) => void;
  success: (props: Omit<ToastProps, "id" | "variant" | "duration">) => void;
  error: (props: Omit<ToastProps, "id" | "variant" | "duration">) => void;
  warning: (props: Omit<ToastProps, "id" | "variant" | "duration">) => void;
  info: (props: Omit<ToastProps, "id" | "variant" | "duration">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    Array<ToastProps & { id: string }>
  >([]);

  const addToast = React.useCallback(
    (props: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...props, id }]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (props: Omit<ToastProps, "id" | "duration">) => {
      return addToast({ ...props, duration: 5000 });
    },
    [addToast]
  );

  const success = React.useCallback(
    (props: Omit<ToastProps, "id" | "variant" | "duration">) => {
      return addToast({ ...props, variant: "success", duration: 5000 });
    },
    [addToast]
  );

  const error = React.useCallback(
    (props: Omit<ToastProps, "id" | "variant" | "duration">) => {
      return addToast({ ...props, variant: "error", duration: 7000 });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (props: Omit<ToastProps, "id" | "variant" | "duration">) => {
      return addToast({ ...props, variant: "warning", duration: 6000 });
    },
    [addToast]
  );

  const info = React.useCallback(
    (props: Omit<ToastProps, "id" | "variant" | "duration">) => {
      return addToast({ ...props, variant: "info", duration: 5000 });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <ToastContainer position="top-right">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
