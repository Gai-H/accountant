"use client"

import MainTable from "@/components/index/main-table"
import PersonsTable from "@/components/index/persons-table"
import PageTitle from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [isMainTable, setIsMainTable] = useState<boolean>(true)

  return (
    <>
      <div className="mb-2 flex justify-between">
        <PageTitle>全員の記録</PageTitle>
        <Button
          className="ml-auto mr-2"
          variant={"outline"}
          onClick={() => setIsMainTable((v) => !v)}
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          テーブルを切替
        </Button>
        <Button asChild>
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            記録を追加
          </Link>
        </Button>
      </div>
      {isMainTable ? <MainTable /> : <PersonsTable />}
    </>
  )
}
