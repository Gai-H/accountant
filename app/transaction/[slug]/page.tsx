import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataRevalidator } from "@/components/data-revalidator"
import PageTitle from "@/components/page-title"
import { getSetting } from "@/lib/firebase/settings"
import { getTransaction } from "@/lib/firebase/transactions"
import { Description, DescriptionSkeleton } from "./cards/description"
import { History, HistorySkeleton } from "./cards/history"
import { MoneyTable, MoneyTableSkeleton } from "./cards/money-table/"
import { RemoveButton } from "./remove-button"

type PageProps = {
  params: {
    slug: string
  }
}

async function Page({ params: { slug } }: PageProps) {
  const transaction = await getTransaction(slug)
  const newTransactionLock = await getSetting("newTransactionLock")

  if (transaction === null || newTransactionLock === null) {
    notFound()
  }

  return (
    <>
      <PageTitle>記録 {transaction.title}</PageTitle>
      <Suspense fallback={<MoneyTableSkeleton />}>
        <MoneyTable transaction={transaction} />
      </Suspense>
      <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
        <Suspense fallback={<DescriptionSkeleton />}>
          <Description description={transaction.description} />
        </Suspense>
        <Suspense fallback={<HistorySkeleton />}>
          <History transaction={transaction} />
        </Suspense>
        <div className="flex gap-2">
          <Button
            className="w-32"
            asChild={true}
          >
            <Link href={`/transaction/${slug}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              編集
            </Link>
          </Button>
          <RemoveButton
            transactionId={slug}
            lock={newTransactionLock}
          />
        </div>
      </div>
      <DataRevalidator />
    </>
  )
}

export default Page
