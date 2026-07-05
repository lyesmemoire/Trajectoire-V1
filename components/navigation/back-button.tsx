"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/design-system";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export function BackButton({ 
  label = "Retour", 
  href, 
  onClick, 
  variant = "ghost",
  className 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className={className}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
