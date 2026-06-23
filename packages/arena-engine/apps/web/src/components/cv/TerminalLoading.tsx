"use client"
import { useEffect, useState } from "react"

export default function TerminalLoading() {
  const lines = [
    "Parsing structural data...",
    "Evaluating impact density...",
    "Running credibility audit...",
    "Finalizing percentile calibration...",
  ]

  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => Math.min(prev + 1, lines.length))
    }, 600)

    return () => clearInterval(interval)
  }, [lines.length])

  return (
    <div className="terminal-loading">
      {lines.slice(0, visible).map((line, i) => (
        <div key={i}>
          {line} <span className="ok">[OK]</span>
        </div>
      ))}
    </div>
  )
}
