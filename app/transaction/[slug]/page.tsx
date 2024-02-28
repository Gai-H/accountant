import Link from "next/link"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataRevalidator } from "@/components/data-revalidator"
import PageTitle from "@/components/page-title"
import { getLock } from "@/lib/firebase/lock"
import { getTransaction } from "@/lib/firebase/transactions"
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
  const transaction = await getTransaction(slug)
  const lock = await getLock()

  if (transaction === null || lock === null) {
    notFound()
  }

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
          lock={lock}
        />
      </div>
      <DataRevalidator />
    </>
  )
}

export default Page
