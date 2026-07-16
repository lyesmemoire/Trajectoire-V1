// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent } from "./card";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  variant?: "default" | "elevated";
  className?: string;
}

export function Testimonial({
  quote,
  author,
  role,
  company,
  avatar,
  variant = "default",
  className,
}: TestimonialProps) {
  return (
    <Card variant={variant} className={className}>
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-primary/20 mb-4" />
        <p className="text-lg text-text mb-6 leading-relaxed">{quote}</p>
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {author.split(" ").map(n => n[0]).join("")}
            </div>
          )}
          <div>
            <p className="font-semibold text-text">{author}</p>
            {(role || company) && (
              <p className="text-sm text-text-secondary">
                {role && `${role}`}
                {role && company && " • "}
                {company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
