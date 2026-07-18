interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
    />
  )
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48 rounded-2xl" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
