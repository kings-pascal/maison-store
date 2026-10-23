import Skeleton from '../../components/ui/Skeleton'
import { detailGridClass } from './detailLayout'

export default function ProductDetailSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading product…</span>
      <div className={detailGridClass}>
        <Skeleton className="aspect-[4/5] rounded-xl" />
        <div className="min-w-0 space-y-3 sm:space-y-4">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-6 w-3/4 rounded sm:h-9" />
          <Skeleton className="h-5 w-20 rounded sm:h-7" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-6 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}