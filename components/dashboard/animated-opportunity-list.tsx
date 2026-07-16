"use client";

import * as React from "react";
import { m } from "framer-motion";

interface AnimatedOpportunityListProps {
  children: React.ReactNode;
}

export function AnimatedOpportunityList({ children }: AnimatedOpportunityListProps) {
  return (
    <div className="space-y-3">
      {React.Children.toArray(children).map((child, index) => (
        <m.div
          key={index}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {child}
        </m.div>
      ))}
    </div>
  );
}
