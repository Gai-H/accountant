import Link from "next/link"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Amount from "@/components/amount"
import { Button } from "@/components/ui/button"
import Timestamp from "@/components/timestamp"
import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { Transaction, Transactions, UsersAllResponse } from "@/types/firebase"

function PersonsTable() {
  const { data: transactions, error, isLoading } = useSWR<Transactions>("/api/transactions/all", { refreshInterval: 10000 })
  const { data: users } = useSWR<UsersAllResponse>("/api/users/all")

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !transactions || !users) return <div className="text-center">Loading...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-52">時間</TableHead>
            <TableHead>項目</TableHead>
            {Object.keys(users).map((key) => (
              <TableHead
                key={key}
                className="text-center"
              >
                {users[key].global_name}
              </TableHead>
            ))}
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(transactions)
            .reverse()
            .map((key) => (
              <TableRow key={transactions[key].timestamp}>
                <TableCell>
                  <Timestamp timestamp={transactions[key].timestamp} />
                </TableCell>
                <TableCell className="shrink-0 font-semibold">{transactions[key].title}</TableCell>
                {Object.keys(users).map((userKey) => (
                  <PersonsTableCell
                    key={userKey}
                    transaction={transactions[key]}
                    userId={userKey}
                  />
                ))}
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
  )
}

export default PersonsTable

type PersonsTableCellProps = {
  transaction: Transaction
  userId: string
}

function PersonsTableCell({ transaction, userId }: PersonsTableCellProps) {
  const lend = transaction.from
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
  const borrowed = transaction.to
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
  const involved = lend !== 0 || borrowed !== 0

  return (
    <TableCell className="text-right">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {involved && (
              <Amount
                amount={-1 * lend + borrowed}
                currency={transaction.currency}
                colored={true}
              />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {involved && (
              <table className="h-fit border-separate">
                <tbody>
                  <tr className="mb-2">
                    <td className="mr-4">貸した額</td>
                    <td>
                      <Amount
                        amount={lend === 0 ? 0 : -1 * lend}
                        currency={transaction.currency}
                        colored={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="mr-4">借りた額</td>
                    <td>
                      <Amount
                        amount={borrowed}
                        currency={transaction.currency}
                        colored={true}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  )
}
