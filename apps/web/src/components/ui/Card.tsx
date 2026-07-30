export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        bg-bg-surface
        border border-white/5
        rounded-2xl
        backdrop-blur-md
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  )
}
