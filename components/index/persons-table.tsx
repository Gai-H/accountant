import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Amount from "@/components/amount"
import Pop from "@/components/pop"
import Timestamp from "@/components/timestamp"
import { Currencies, Transaction, Transactions, UsersGetResponse } from "@/types/firebase"

function PersonsTable() {
  const { data: transactions, error: transactionsError, isLoading: transactionsIsLoading } = useSWR<Transactions>("/api/transactions", { refreshInterval: 10000 })
  const { data: users, error: usersError, isLoading: usersIsLoading } = useSWR<UsersGetResponse>("/api/users")
  const { data: currencies, error: currenciesError, isLoading: currenciesIsLoading } = useSWR<Currencies>("/api/currencies")

  if (transactionsError || usersError || currenciesError) {
    return <div className="text-center">Failed to load</div>
  }

  if (transactionsIsLoading || usersIsLoading || currenciesIsLoading || !transactions || !users || !currencies) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="rounded-md border">
      <Table className="whitespace-nowrap">
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
          <TableRow className="bg-slate-100">
            <TableCell />
            <TableCell className="font-semibold">合計</TableCell>
            {Object.keys(users).map((userId) => (
              <PersonsTableTotalAmountTableCell
                key={userId}
                transactions={transactions}
                currencies={currencies}
                userId={userId}
              />
            ))}
            <TableCell />
          </TableRow>
          {Object.keys(transactions)
            .reverse()
            .map((transactionId) => (
              <TableRow key={transactions[transactionId].timestamp}>
                <TableCell>
                  <Timestamp timestamp={transactions[transactionId].timestamp} />
                </TableCell>
                <TableCell className="font-semibold">{transactions[transactionId].title}</TableCell>
                {Object.keys(users).map((userId) => (
                  <PersonsTableCell
                    key={userId}
                    transaction={transactions[transactionId]}
                    userId={userId}
                  />
                ))}
                <TableCell>
                  <Link href={`/transaction/${transactionId}`}>
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

type PersonsTableTotalAmountTableCellProps = {
  transactions: Transactions
  currencies: Currencies
  userId: string
}

function PersonsTableTotalAmountTableCell({ transactions, currencies, userId }: PersonsTableTotalAmountTableCellProps) {
  const totalAmounts = Object.values(transactions).reduce(
    (acc, transaction) => {
      const lend = getLendAmount(transaction, userId)
      const borrowed = getBorrowedAmount(transaction, userId)
      const involved = lend !== 0 || borrowed !== 0

      if (!involved) {
        return acc
      }

      const currencyId = transaction.currency
      const amount = -1 * lend + borrowed

      if (!acc[currencyId]) {
        acc[currencyId] = 0
      }

      acc[currencyId] += amount

      return acc
    },
    {} as { [currencyId: string]: number },
  )

  const totalAmountInJPY = Object.keys(totalAmounts).reduce((acc, currencyId) => {
    return acc + totalAmounts[currencyId] * currencies[currencyId].oneInJPY
  }, 0)

  return (
    <TableCell className="text-right">
      {Object.keys(currencies).map((currencyId) => (
        <Amount
          key={currencyId}
          amount={totalAmounts[currencyId] ?? 0}
          currency={currencyId}
          colored={true}
        />
      ))}
      <div className="my-2 h-[1px] w-full bg-slate-300" />
      <Amount
        amount={totalAmountInJPY}
        currency="JPY"
        colored={true}
      />
    </TableCell>
  )
}

type PersonsTableCellProps = {
  transaction: Transaction
  userId: string
}

function PersonsTableCell({ transaction, userId }: PersonsTableCellProps) {
  const lend = getLendAmount(transaction, userId)
  const borrowed = getBorrowedAmount(transaction, userId)
  const involved = lend !== 0 || borrowed !== 0

  return (
    <TableCell className="text-right">
      <Pop
        trigger={
          involved ? (
            <Amount
              amount={-1 * lend + borrowed}
              currency={transaction.currency}
              colored={true}
            />
          ) : (
            <></>
          )
        }
        content={
          involved ? (
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
          ) : (
            <></>
          )
        }
      />
    </TableCell>
  )
}

const getLendAmount = (transaction: Transaction, userId: string): number => {
  return transaction.from
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
}

const getBorrowedAmount = (transaction: Transaction, userId: string): number => {
  return transaction.to
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
}
