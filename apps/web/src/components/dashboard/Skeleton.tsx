export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 bg-ivoire-200 rounded w-48 animate-pulse"></div>
          <div className="h-5 bg-ivoire-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-10 bg-ivoire-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl p-6 rounded-lg border border-ivoire-200">
            <div className="h-4 bg-ivoire-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-8 bg-ivoire-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Last simulation skeleton */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-lg border border-ivoire-200">
        <div className="h-6 bg-ivoire-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-ivoire-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-ivoire-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-ivoire-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Recent history skeleton */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-lg border border-ivoire-200">
        <div className="h-6 bg-ivoire-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-ivoire-200 rounded w-40 animate-pulse"></div>
                <div className="h-3 bg-ivoire-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-8 bg-ivoire-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
