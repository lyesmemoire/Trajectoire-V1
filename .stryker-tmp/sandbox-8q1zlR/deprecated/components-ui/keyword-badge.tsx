// @ts-nocheck
interface KeywordBadgeProps {
  keyword: string;
  status: "matched" | "missing";
}

export function KeywordBadge({ keyword, status }: KeywordBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md px-2 py-0.5
        text-xs font-medium capitalize
        ${
          status === "matched"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-red-50 text-red-600 ring-1 ring-red-200"
        }
      `}
    >
      <span>{status === "matched" ? "✓" : "✗"}</span>
      {keyword}
    </span>
  );
}
