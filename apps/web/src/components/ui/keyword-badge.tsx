interface KeywordBadgeProps {
  keyword: string
  status: "matched" | "missing"
}

export function KeywordBadge({ keyword, status }: KeywordBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md px-2 py-0.5
        text-xs font-medium capitalize
        ${
          status === "matched"
            ? "bg-forest-50 text-forest-700 ring-1 ring-forest-200"
            : "bg-brick-50 text-brick-600 ring-1 ring-brick-200"
        }
      `}
    >
      <span>{status === "matched" ? "✓" : "✗"}</span>
      {keyword}
    </span>
  )
}
