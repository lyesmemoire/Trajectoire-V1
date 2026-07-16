"use client"

import dynamic from "next/dynamic"

export interface SparklineProps {
  data: { score: number }[]
  color?: string
}

const loading = () => <div className="h-10 w-full mt-2 animate-pulse bg-slate-100 rounded" />

export const Sparkline = dynamic(
  () => import('./Sparkline.client').then(m => m.Sparkline),
  { ssr: false, loading }
)
