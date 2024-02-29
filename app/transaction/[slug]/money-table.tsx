import { notFound } from "next/navigation"
import { ChevronsDown, ChevronsRight } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCurrency } from "@/lib/firebase/currencies"
import { getUser } from "@/lib/firebase/users"
import { Transaction } from "@/types/firebase"

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

type PersonCardProps = {
  userId: string
  amount: number
  currencyId: string
}

async function PersonCard({ userId, amount, currencyId }: PersonCardProps) {
  const user = await getUser(userId)
  const currency = await getCurrency(currencyId)

  if (user === null || currency === null) {
    notFound()
  }

  const formattedAmount = amount.toLocaleString("ja-JP", { maximumFractionDigits: 2, minimumFractionDigits: 0 })

  return (
    <Card className="shadow-none py-2.5 px-4">
      <CardContent className="flex items-center p-0">
        <Avatar className="mr-2.5">
          <AvatarImage
            src={user.image}
            alt={user.displayName}
          />
        </Avatar>
        <p className="mr-auto">{user.displayName}</p>
        <p>
          <span className="mr-1.5">{currency.symbol}</span>
          {formattedAmount}
        </p>
      </CardContent>
    </Card>
  )
}

type PersonCardListProps = {
  data: {
    id: string
    amount: number
  }[]
  currencyId: string
}

function PersonCardList({ data, currencyId }: PersonCardListProps) {
  return (
    <li className="flex flex-col gap-4 list-none">
      {data.map(({ id, amount }) => (
        <ul
          className="w-full"
          key={id}
        >
          <PersonCard
            userId={id}
            amount={amount}
            currencyId={currencyId}
          />
        </ul>
      ))}
    </li>
  )
}

type SumProps = {
  sum: number
  currencyId: string
}

async function Sum({ sum, currencyId }: SumProps) {
  const currency = await getCurrency(currencyId)

  if (currency === null) {
    notFound()
  }

  return (
    <div className="flex items-center w-full">
      <h2 className="ml-auto text-lg font-medium">合計</h2>
      <p className="mx-3">
        <span className="mr-1.5">{currency.symbol}</span>
        {sum.toLocaleString("ja-JP")}
      </p>
    </div>
  )
}
