"use client"

import useSWR from "swr"
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Timestamp from "../timestamp"
import Amount from "../amount"
import { Transaction, UsersAllResponse } from "@/types/firebase"

function MainTable() {
  const { data: res, error, isLoading } = useSWR<Transaction[]>("/api/transactions/all", { refreshInterval: 10000 })

  const getFromSum = (transaction: Transaction) => {
    return transaction.from.map((f) => f.amount).reduce((a, b) => a + b, 0)
  }

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !res) return <div className="text-center">Loading...</div>

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-52">時間</TableHead>
              <TableHead className="shrink-0">項目</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res.map((row) => (
              <TableRow key={row.timestamp}>
                <TableCell>
                  <Timestamp timestamp={row.timestamp} />
                </TableCell>
                <TableCell className="shrink-0 font-semibold">
                  <div>{row.title}</div>
                </TableCell>
                <TableCell>
                  <Amount
                    amount={getFromSum(row)}
                    currency={row.currency}
                  />
                </TableCell>
                <TableCell>
                  <Avatars
                    data={row.from}
                    currency={row.currency}
                  />
                </TableCell>
                <TableCell>
                  <Avatars
                    data={row.to}
                    currency={row.currency}
                  />
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
              {Number.isInteger(d.amount) ? d.amount : d.amount.toFixed(2)}
              <span className="ml-1">{currency}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
