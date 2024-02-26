import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import Timestamp from "@/components/timestamp"
import { Transaction, Users } from "@/types/firebase"
import { NormalAmountTableCell } from "./normal-amount-table-cell"

type NormalTableRowProps = {
  transaction: Transaction
  transactionId: string
  users: Users
}

function NormalTableRow({ transaction, transactionId, users }: NormalTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Timestamp timestamp={transaction.timestamp} />
      </TableCell>
      <TableCell className="font-semibold">{transaction.title}</TableCell>
      {Object.keys(users).map((userId) => (
        <NormalAmountTableCell
          key={userId}
          transaction={transaction}
          userId={userId}
        />
      ))}
      <TableCell>
        <Link href={`/transaction/${transactionId}`}>
          <Button variant="secondary">詳細</Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}

export { NormalTableRow }
