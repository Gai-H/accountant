import { Skeleton } from "@/components/ui/skeleton"
import PageTitle from "@/components/page-title"

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <PageTitle>記録を追加する</PageTitle>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="w-24 h-5 mb-3" />
          <Skeleton className="w-full h-10 rounded-md md:w-80" />
        </div>
      ))}
    </div>
  )
}

export { FormSkeleton }
