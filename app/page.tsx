import { Suspense } from "react"
import { notFound } from "next/navigation"
import { DataRevalidator } from "@/components/data-revalidator"
import { AddTransactionButton } from "@/components/index/add-transaction-button"
import { PersonsTable } from "@/components/index/persons-table/table"
import { PersonsTableSkeleton } from "@/components/index/persons-table/table-skeleton"
import PageTitle from "@/components/page-title"
import { getLock } from "@/lib/firebase/lock"

async function Page() {
  const lock = await getLock()

  if (lock === null) {
    notFound()
  }

  return (
    <>
      <div className="flex justify-between mb-2">
        <PageTitle>記録一覧</PageTitle>
        <AddTransactionButton lock={lock} />
      </div>
      <Suspense fallback={<PersonsTableSkeleton />}>
        <PersonsTable />
      </Suspense>
      <DataRevalidator />
    </>
  )
}

export default Page
