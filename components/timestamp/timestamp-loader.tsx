import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const TimestampWithLoader = dynamic(() => import("./timestamp"), { ssr: false, loading: () => <Skeleton className="w-24 h-5" /> })

export { TimestampWithLoader }
