"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import MainTable from "@/components/index/main-table"
import PersonsTable from "@/components/index/persons-table"
import PageTitle from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeftRight } from "lucide-react"

export default function Home() {
  const { isMainTable, toggleMainTable } = useMainTable()

  return (
    <>
      <div className="mb-2 flex justify-between">
        <PageTitle>全員の記録</PageTitle>
        <TableToggleButton toggleMainTable={toggleMainTable} />
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

type UseMainTable = {
  isMainTable: boolean
  toggleMainTable: () => void
}

const useMainTable = (): UseMainTable => {
  const [isMainTable, setIsMainTable] = useState<boolean>(true)

  useEffect(() => {
    setIsMainTable(localStorage.getItem("isMainTable") === "true")
  }, [])

  const toggleMainTable = () => {
    setIsMainTable((v) => {
      localStorage.setItem("isMainTable", (!v).toString())
      return !v
    })
  }

  return { isMainTable, toggleMainTable }
}

type TableToggleButtonProps = {
  toggleMainTable: () => void
}

function TableToggleButton({ toggleMainTable }: TableToggleButtonProps) {
  return (
    <>
      <Button
        className="ml-auto mr-2 hidden md:inline-flex"
        variant="outline"
        onClick={toggleMainTable}
      >
        <ArrowLeftRight className="mr-2 h-4 w-4" />
        テーブルを切替
      </Button>
      <Button
        className="ml-auto mr-2 md:hidden"
        variant="outline"
        size="icon"
        onClick={toggleMainTable}
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
    </>
  )
}
