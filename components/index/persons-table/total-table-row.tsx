import { TableCell, TableRow } from "@/components/ui/table"
import { Currencies, Transactions, Users } from "@/types/firebase"
import { TotalAmountTableCell } from "./total-amount-table-cell"

type TotalTableRowProps = {
  transactions: Transactions
  currencies: Currencies
  users: Users
}

function TotalTableRow({ transactions, currencies, users }: TotalTableRowProps) {
  return (
    <TableRow className="bg-slate-100">
      <TableCell /> {/* 時間 */}
      <TableCell className="font-semibold">合計</TableCell>
      {Object.keys(users).map((userId) => (
        <TotalAmountTableCell
          key={userId}
          transactions={transactions}
          currencies={currencies}
          userId={userId}
        />
      ))}
      <TableCell /> {/* 詳細 */}
    </TableRow>
  )
}

export { TotalTableRow }
