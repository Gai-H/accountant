import { Skeleton } from "@/components/ui/skeleton"

function PersonsTableSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton
          key={idx}
          className="h-14"
        />
      ))}
    </div>
  )
}

export { PersonsTableSkeleton }
