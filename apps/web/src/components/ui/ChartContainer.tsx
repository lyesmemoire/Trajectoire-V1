"use client";

import { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  children: ReactElement;
  height?: number | string;
  minHeight?: number | string;
  className?: string;
}

export function ChartContainer({ 
  children, 
  height = 280, 
  minHeight = 280,
  className = ""
}: ChartContainerProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const minHeightValue = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
  const heightNumber = typeof height === 'number' ? height : parseInt(height, 10);

  return (
    <div 
      className={`w-full ${className}`} 
      style={{ height: heightValue, minHeight: minHeightValue }}
    >
      <ResponsiveContainer width="100%" height={heightNumber} aspect={undefined}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
