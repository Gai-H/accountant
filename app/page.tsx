import Table from "@/components/index/table"
import PageTitle from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  return (
    <>
      <div className="mb-2 flex justify-between">
        <PageTitle>全員の記録</PageTitle>
        <Button
          className="ml-auto"
          asChild
        >
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            記録を追加
          </Link>
        </Button>
      </div>
      <Table />
    </>
  )
}
