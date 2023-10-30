"use client"

import useSWR, { Fetcher } from "swr"
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Avatar from "../avatar"
import Timestamp from "../timestamp"
import Amount from "../amount"
import { Transaction } from "@/types/firebase"
import { Response } from "@/types/api"

const fetcher: Fetcher<Response<Transaction[]>, string> = (...args) => fetch(...args).then((res) => res.json())

function MainTable() {
  const { data: res, error, isLoading } = useSWR<Response<Transaction[]>>("/api/transactions/all", fetcher, { refreshInterval: 10000 })

  const getFromSum = (transaction: Transaction) => {
    return transaction.from.map((f) => f.amount).reduce((a, b) => a + b, 0)
  }

  if (error || (res && res.message === "error")) return <div className="text-center">Failed to load</div>

  if (isLoading) return <div className="text-center">Loading...</div>

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>時間</TableHead>
              <TableHead>項目</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res?.data.map((row) => (
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
  return (
    <div className="flex gap-2">
      {data.map((d) => (
        <TooltipProvider key={d.id}>
          <Tooltip>
            <TooltipTrigger>
              <Avatar id={d.id} />
            </TooltipTrigger>
            <TooltipContent>
              <div className="mb-1 text-center font-semibold">{d.id}</div>
              {Number.isInteger(d.amount) ? d.amount : d.amount.toFixed(2)}
              <span className="ml-1">{currency}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
