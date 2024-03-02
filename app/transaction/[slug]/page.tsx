import Link from "next/link"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataRevalidator } from "@/components/data-revalidator"
import PageTitle from "@/components/page-title"
import { getLock } from "@/lib/firebase/lock"
import { getTransaction } from "@/lib/firebase/transactions"
import { Description } from "./cards/description.tsx/description"
import { History } from "./cards/history/history"
import { MoneyTable } from "./cards/money-table/money-table"
import { RemoveButton } from "./remove-button"

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
      <MoneyTable transaction={transaction} />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 [&>*]:w-full [&>*]:h-fit">
        <Description description={transaction.description} />
        <History transaction={transaction} />
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
      </div>
      <DataRevalidator />
    </>
  )
}

export default Page
