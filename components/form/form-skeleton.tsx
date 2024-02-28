import { Skeleton } from "@/components/ui/skeleton"
import PageTitle from "@/components/page-title"

type FormSkeletonProps = {
  edit: boolean
}

function FormSkeleton({ edit }: FormSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      <PageTitle>記録を{edit ? "編集" : "追加"}する</PageTitle>
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
