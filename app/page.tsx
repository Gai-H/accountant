import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AddTransactionButton } from "@/components/index/add-transaction-button"
import { PersonsTable } from "@/components/index/persons-table/table"
import { PersonsTableSkeleton } from "@/components/index/persons-table/table-skeleton"
import PageTitle from "@/components/page-title"
import { getSetting } from "@/lib/firebase/settings"

async function Page() {
  const newTransactionLock = await getSetting("newTransactionLock")

  if (newTransactionLock === null) {
    notFound()
  }

  return (
    <>
      <div className="flex justify-between mb-2">
        <PageTitle>記録一覧</PageTitle>
        <AddTransactionButton lock={newTransactionLock} />
      </div>
      <Suspense fallback={<PersonsTableSkeleton />}>
        <PersonsTable />
      </Suspense>
    </>
  )
}

export default Page
