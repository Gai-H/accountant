import { notFound } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCurrencies } from "@/lib/firebase/currencies"
import { getTransactions } from "@/lib/firebase/transactions"
import { getUsers } from "@/lib/firebase/users"
import { Currencies, Transactions, Users } from "@/types/firebase"
import { NormalTableRow } from "./normal-table-row"
import { TotalTableRow } from "./total-table-row"

type UseData =
  | {
      transactions: Transactions
      users: Users
      currencies: Currencies
    }
  | undefined

const useData = async (): Promise<UseData> => {
  const transactions = await getTransactions()
  const users = await getUsers()
  const currencies = await getCurrencies()

  if (transactions === null || users === null || currencies === null) {
    return undefined
  }

  return {
    transactions,
    users,
    currencies,
  }
}

async function PersonsTable() {
  const data = await useData()

  if (data === undefined) {
    notFound()
  }

  const { transactions, users, currencies } = data

  return (
    <div className="border rounded-md">
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
                {users[key].displayName}
              </TableHead>
            ))}
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TotalTableRow
            transactions={transactions}
            currencies={currencies}
            users={users}
          />
          {Object.keys(transactions)
            .reverse()
            .map((transactionId) => (
              <NormalTableRow
                key={transactionId}
                transaction={transactions[transactionId]}
                transactionId={transactionId}
                users={users}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { PersonsTable }
