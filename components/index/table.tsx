"use client"

import useSWR from "swr"
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Timestamp from "../timestamp"
import Amount from "../amount"
import { Transaction, Transactions, UsersAllResponse } from "@/types/firebase"
import Link from "next/link"

function MainTable() {
  const { data: res, error, isLoading } = useSWR<Transactions>("/api/transactions/all", { refreshInterval: 10000 })

  const getFromSum = (transaction: Transaction) => {
    return transaction.from.map((f) => f.amount).reduce((a, b) => a + b, 0)
  }

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !res) return <div className="text-center">Loading...</div>

  return (
    <>
      <div className="rounded-md border">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-52 rounded-t-md border-b">時間</TableHead>
              <TableHead className="shrink-0 border-b">項目</TableHead>
              <TableHead className="border-b">金額</TableHead>
              <TableHead className="border-b">貸した人</TableHead>
              <TableHead className="border-b">借りた人</TableHead>
              <TableHead className="w-20 rounded-t-md border-b"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(res)
              .reverse()
              .map((key, idx) => (
                <TableRow key={res[key].timestamp}>
                  <TableCell className={idx !== Object.keys(res).length - 1 ? "border-b" : ""}>
                    <Timestamp timestamp={res[key].timestamp} />
                  </TableCell>
                  <TableCell className={`shrink-0 font-semibold ${idx !== Object.keys(res).length - 1 ? "border-b" : ""}`}>
                    <div>{res[key].title}</div>
                  </TableCell>
                  <TableCell className={idx !== Object.keys(res).length - 1 ? "border-b" : ""}>
                    <Amount
                      amount={getFromSum(res[key])}
                      currency={res[key].currency}
                    />
                  </TableCell>
                  <TableCell className={idx !== Object.keys(res).length - 1 ? "border-b" : ""}>
                    <Avatars
                      data={res[key].from}
                      currency={res[key].currency}
                    />
                  </TableCell>
                  <TableCell className={idx !== Object.keys(res).length - 1 ? "border-b" : ""}>
                    <Avatars
                      data={res[key].to}
                      currency={res[key].currency}
                    />
                  </TableCell>
                  <TableCell className={idx !== Object.keys(res).length - 1 ? "border-b" : ""}>
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
  const { data: res } = useSWR<UsersAllResponse>("/api/users/all")

  return (
    <div className="flex gap-2">
      {data.map((d) => (
        <TooltipProvider key={d.id}>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="inline-block h-9 w-9">
                {res && (
                  <AvatarImage
                    src={res[d.id].image_url}
                    alt={res[d.id].global_name}
                  />
                )}
                {res ? <AvatarFallback>{res[d.id].global_name.substring(0, 3)}</AvatarFallback> : <AvatarFallback>...</AvatarFallback>}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <div className="mb-1 text-center font-semibold">{res ? res[d.id].global_name : "Loading..."}</div>
              <Amount
                amount={d.amount}
                currency={currency}
              />{" "}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
