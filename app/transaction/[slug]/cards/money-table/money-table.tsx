import { ChevronsDown, ChevronsRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Transaction } from "@/types/firebase"
import { PersonCardList } from "./person-card-list"
import { Sum } from "./sum"

type MoneyTableProps = {
  transaction: Transaction
}

function MoneyTable({ transaction: { from, to, currency } }: MoneyTableProps) {
  const sum = from.map((f) => f.amount).reduce((a, b) => a + b, 0)

  return (
    <Card className="p-6 shadow-none">
      <CardContent className="flex flex-col gap-6 p-0">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_5rem_1fr] gap-4">
          <h2 className="order-1 text-lg font-medium md:col-span-2 md:order-none">貸した人</h2>
          <h2 className="order-4 text-lg font-medium md:order-none">借りた人</h2>
          <div className="order-2 md:order-none">
            <PersonCardList
              data={from}
              currencyId={currency}
            />
          </div>
          <div className="flex items-center justify-center order-3 my-3 md:order-none md:my-0">
            <ChevronsRight className="hidden w-6 h-6 md:block" />
            <ChevronsDown className="w-6 h-6 md:hidden" />
          </div>
          <div className="order-4 md:order-none">
            <PersonCardList
              data={to}
              currencyId={currency}
            />
          </div>
        </div>
        <Separator className="col-span-3" />
        <Sum
          sum={sum}
          currencyId={currency}
        />
      </CardContent>
    </Card>
  )
}

export { MoneyTable }
