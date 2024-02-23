import { notFound } from "next/navigation"
import PageTitle from "@/components/page-title"
import { getLock } from "@/lib/firebase/lock"
import { getTransactions } from "@/lib/firebase/transactions"
import { Description } from "./description"
import { MoneyTable } from "./money-table"
import { RemoveButton } from "./remove-button"
import { Submitter } from "./submitter"

type PageProps = {
  params: {
    slug: string
  }
}

async function Page({ params: { slug } }: PageProps) {
  const transactions = await getTransactions()
  const lock = await getLock()

  if (transactions === null || !(slug in transactions) || lock === null) {
    notFound()
  }

  const transaction = transactions[slug]

  return (
    <>
      <PageTitle>記録 {transaction.title}</PageTitle>
      <div className="flex flex-col gap-4 mb-8 md:gap-6 md:grid md:grid-cols-2">
        <div className="col-span-2">
          <MoneyTable transaction={transaction} />
        </div>
        <Description description={transaction.description} />
        <Submitter
          userId={transaction.addedBy}
          timestamp={transaction.timestamp}
        />
      </div>
      <RemoveButton
        transactionId={slug}
        lock={lock}
      />
    </>
  )
}

export default Page
