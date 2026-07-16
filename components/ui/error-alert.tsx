import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/design-system/button";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  variant?: "error" | "warning";
}

export function ErrorAlert({ message, onDismiss, variant = "error" }: ErrorAlertProps) {
  const bgColor = variant === "error" ? "bg-red-50" : "bg-yellow-50";
  const textColor = variant === "error" ? "text-red-800" : "text-yellow-800";
  const iconColor = variant === "error" ? "text-red-600" : "text-yellow-600";
  const borderColor = variant === "error" ? "border-red-200" : "border-yellow-200";

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className={`text-${variant === "error" ? "red" : "yellow"}-600 hover:bg-${variant === "error" ? "red" : "yellow"}-100`}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
