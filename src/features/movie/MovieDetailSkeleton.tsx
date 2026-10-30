import { Skeleton } from '@/components/ui/skeleton'

export function MovieDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8" role="status" aria-label="Chargement du film">
      <Skeleton className="mb-6 h-8 w-24" />
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Skeleton className="aspect-2/3 w-40 shrink-0 rounded-2xl sm:w-64" />
        <div className="glass flex-1 space-y-4 rounded-2xl p-5 sm:p-6">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
