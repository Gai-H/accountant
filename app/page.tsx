"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { ArrowLeftRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainTable from "@/components/index/main-table"
import PersonsTable from "@/components/index/persons-table"
import PageTitle from "@/components/page-title"
import Pop from "@/components/pop"

export default function Home() {
  const { isMainTable, toggleMainTable } = useMainTable()

  return (
    <>
      <div className="mb-2 flex justify-between">
        <PageTitle>記録一覧</PageTitle>
        <TableToggleButton toggleMainTable={toggleMainTable} />
        <AddTransactionButton />
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

function AddTransactionButton() {
  const { data: lock, isLoading, error } = useSWR("/api/lock")

  if (!isLoading && !error && !lock) {
    return (
      <Button asChild>
        <Link href="/create">
          <Plus className="mr-2 h-4 w-4" />
          記録を追加
        </Link>
      </Button>
    )
  }

  return (
    <Pop
      trigger={
        <Button
          asChild
          disabled={true}
          className="opacity-50 pointer-events-none"
        >
          <span>
            <Plus className="mr-2 h-4 w-4" />
            記録を追加
          </span>
        </Button>
      }
      content={
        <>
          {isLoading && <div>読み込み中...</div>}
          {error && <div>エラーが発生しました</div>}
          {lock && <div>このプロジェクトはロックされています</div>}
        </>
      }
    />
  )
}
