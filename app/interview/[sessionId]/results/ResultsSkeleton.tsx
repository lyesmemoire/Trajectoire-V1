export function ResultsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      <div className="rounded-3xl bg-gray-100 h-48" />
      <div className="h-10 bg-gray-100 rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-gray-100 h-24" />
        ))}
      </div>
    </div>
  );
}
