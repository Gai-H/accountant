"use client"

import Amount from "@/components/amount"
import PageTitle from "@/components/page-title"
import Timestamp from "@/components/timestamp"
import { Transactions } from "@/types/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { notFound } from "next/navigation"
import useSWR from "swr"

type PageProps = {
  params: {
    slug: string
  }
}

function Page({ params: { slug } }: PageProps) {
  const { data: res, error, isLoading } = useSWR<Transactions>("/api/transactions/all", { refreshInterval: 10000 })

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !res) return <div className="text-center">Loading...</div>

  const transaction = res[slug]
  if (!transaction) notFound()

  return (
    <>
      <PageTitle>記録 {transaction.title}</PageTitle>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ItemTitle>日時</ItemTitle>
          <div>
            <Timestamp timestamp={transaction.timestamp} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ItemTitle>登録者</ItemTitle>
          <AvatarWithName id={transaction.addedBy} />
        </div>
        <div className="flex items-center gap-2">
          <ItemTitle>合計</ItemTitle>
          <div>
            <Amount
              amount={transaction.from.map((f) => f.amount).reduce((a, b) => a + b, 0)}
              currency={transaction.currency}
            />
          </div>
        </div>
        <div className="hidden w-fit grid-cols-[1fr_4rem_1fr] grid-rows-[2rem_1fr] md:grid">
          <div>
            <ItemTitle>貸した人</ItemTitle>
          </div>
          <div className="col-start-3">
            <ItemTitle>借りた人</ItemTitle>
          </div>
          <div className="col-start-2 row-start-2 row-end-3 flex items-center justify-center">→</div>
          <FromToTable
            data={transaction.from}
            currency={transaction.currency}
          />
          <FromToTable
            data={transaction.to}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2 md:hidden">
          <ItemTitle>貸した人</ItemTitle>
          <FromToTable
            data={transaction.from}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2 md:hidden">
          <ItemTitle>借りた人</ItemTitle>
          <FromToTable
            data={transaction.to}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2">
          <ItemTitle>説明</ItemTitle>
          {transaction.description ? <div>{transaction.description}</div> : <div className="italic">なし</div>}
        </div>
      </div>
    </>
  )
}

export default Page

type ItemTitleProps = {
  children: React.ReactNode
}

function ItemTitle({ children }: ItemTitleProps) {
  return <h2 className="block w-[4.5rem] shrink-0 text-lg font-semibold">{children}</h2>
}

type AvatarWithNameProps = {
  id: string
}

function AvatarWithName({ id }: AvatarWithNameProps) {
  const { data: users } = useSWR("/api/users/all")

  return (
    <div className="flex items-center gap-2">
      <Avatar className="block h-6 w-6">
        {users && (
          <AvatarImage
            src={users[id].image_url}
            alt={users[id].global_name}
          />
        )}
        {users ? <AvatarFallback>{users[id].global_name.substring(0, 3)}</AvatarFallback> : <AvatarFallback>...</AvatarFallback>}
      </Avatar>
      <div>{users ? users[id].global_name : "..."}</div>
    </div>
  )
}

type FromToTableProps = {
  data: {
    id: string
    amount: number
  }[]
  currency: string
}

function FromToTable({ data, currency }: FromToTableProps) {
  return (
    <table className="h-fit border-separate">
      <tbody>
        {data.map((f) => (
          <tr key={f.id}>
            <td className="pb-2 pr-4">
              <AvatarWithName id={f.id} />
            </td>
            <td className="pb-2 pr-4">
              <Amount
                amount={f.amount}
                currency={currency}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
