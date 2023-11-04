import Link from "next/link"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Amount from "@/components/amount"
import { Button } from "@/components/ui/button"
import Timestamp from "@/components/timestamp"
import { Transaction, Transactions, UsersAllResponse } from "@/types/firebase"

function PersonsTable() {
  const { data: transactions, error, isLoading } = useSWR<Transactions>("/api/transactions/all", { refreshInterval: 10000 })
  const { data: users } = useSWR<UsersAllResponse>("/api/users/all")

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !transactions || !users) return <div className="text-center">Loading...</div>

  const getBorrowedAmounts = (t: Transaction, userId: string): number => {
    const lend = t.from
      .filter((f) => f.id === userId)
      .map((f) => f.amount)
      .reduce((a, b) => a + b, 0)
    const borrowed = t.to
      .filter((f) => f.id === userId)
      .map((f) => f.amount)
      .reduce((a, b) => a + b, 0)

    return -1 * lend + borrowed
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-52">時間</TableHead>
            <TableHead>項目</TableHead>
            {Object.keys(users).map((key) => (
              <TableHead key={key}>{users[key].global_name}</TableHead>
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
                  <TableCell key={userKey}>
                    <Amount
                      amount={getBorrowedAmounts(transactions[key], userKey)}
                      currency={transactions[key].currency}
                    />
                  </TableCell>
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
