import Link from "next/link"
import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Amount from "@/components/amount"
import Pop from "@/components/pop"
import Timestamp from "@/components/timestamp"
import { Currencies, Transactions, UsersAllResponse } from "@/types/firebase"

function MainTable() {
  const { data: res, error: resError, isLoading: resIsLoading } = useSWR<Transactions>("/api/transactions", { refreshInterval: 10000 })
  const { data: currencies, error: currenciesError, isLoading: currenciesIsLoading } = useSWR<Currencies>("/api/currencies")

  if (resError || currenciesError) return <div className="text-center">Failed to load</div>

  if (resIsLoading || currenciesIsLoading || !res || !currencies) return <div className="text-center">Loading...</div>

  const totalAmountByTransaction: {
    [key: string]: {
      amount: number
      currency: string
    }
  } = Object.keys(res).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        amount: res[key].from.map((f) => f.amount).reduce((a, b) => a + b, 0),
        currency: res[key].currency,
      },
    }
  }, {})

  const totalAmountByCurrency: {
    [currency: string]: number
  } = Object.keys(totalAmountByTransaction).reduce((acc, key) => {
    return {
      ...acc,
      [totalAmountByTransaction[key].currency]:
        totalAmountByTransaction[key].currency in acc ? acc[totalAmountByTransaction[key].currency as keyof typeof acc] + totalAmountByTransaction[key].amount : totalAmountByTransaction[key].amount,
    }
  }, {})

  const totalAmountInJPY = Object.keys(totalAmountByCurrency).reduce((acc, currency) => {
    return acc + totalAmountByCurrency[currency] * currencies[currency].oneInJPY
  }, 0)

  return (
    <>
      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead className="w-52">時間</TableHead>
              <TableHead>項目</TableHead>
              <TableHead className="text-center">金額</TableHead>
              <TableHead>貸した人</TableHead>
              <TableHead>借りた人</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-slate-100">
              <TableCell />
              <TableCell className="font-semibold">合計</TableCell>
              <TableCell className="text-right">
                {Object.keys(currencies).map((currency) => (
                  <Amount
                    key={currency}
                    amount={totalAmountByCurrency[currency] ?? 0}
                    currency={currency}
                  />
                ))}
                <div className="my-2 h-[1px] w-full bg-slate-300" />
                <Amount
                  amount={totalAmountInJPY}
                  currency="JPY"
                />
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            {Object.keys(res)
              .reverse()
              .map((key) => (
                <TableRow key={res[key].timestamp}>
                  <TableCell>
                    <Timestamp timestamp={res[key].timestamp} />
                  </TableCell>
                  <TableCell className="font-semibold">
                    <div>{res[key].title}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Amount
                      amount={totalAmountByTransaction[key].amount}
                      currency={totalAmountByTransaction[key].currency}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatars
                      data={res[key].from}
                      currency={res[key].currency}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatars
                      data={res[key].to}
                      currency={res[key].currency}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/transaction/${key}`}>
                      <Button variant="secondary">詳細</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default MainTable

type AvatarsProps = {
  data: {
    id: string
    amount: number
  }[]
  currency: string
}

function Avatars({ data, currency }: AvatarsProps) {
  const { data: res } = useSWR<UsersAllResponse>("/api/users")

  return (
    <div className="flex gap-2">
      {[...data]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((d) => (
          <Pop
            key={d.id}
            trigger={
              <Avatar className="inline-block h-9 w-9">
                {res && (
                  <AvatarImage
                    src={res[d.id].image_url}
                    alt={res[d.id].global_name}
                  />
                )}
                {res ? <AvatarFallback>{res[d.id].global_name.substring(0, 3)}</AvatarFallback> : <AvatarFallback>...</AvatarFallback>}
              </Avatar>
            }
            content={
              <>
                <div className="mb-1 text-center font-semibold">{res ? res[d.id].global_name : "Loading..."}</div>
                <Amount
                  amount={d.amount}
                  currency={currency}
                />
              </>
            }
          />
        ))}
    </div>
  )
}
