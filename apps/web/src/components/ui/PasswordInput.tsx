"use client";

import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          className="pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
