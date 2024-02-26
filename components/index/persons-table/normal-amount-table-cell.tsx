import { TableCell } from "@/components/ui/table"
import Amount from "@/components/amount"
import Pop from "@/components/pop"
import { Transaction } from "@/types/firebase"
import { getBorrowedAmount, getLendAmount } from "./calc"

type NormalAmountTableCellProps = {
  transaction: Transaction
  userId: string
}

function NormalAmountTableCell({ transaction, userId }: NormalAmountTableCellProps) {
  const lend = getLendAmount(transaction, userId)
  const borrowed = getBorrowedAmount(transaction, userId)
  const involved = lend !== 0 || borrowed !== 0

  return (
    <TableCell className="text-right">
      <Pop
        trigger={
          involved ? (
            <Amount
              amount={borrowed - lend}
              currency={transaction.currency}
              colored={true}
            />
          ) : null
        }
        content={
          <table className="border-separate h-fit">
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
        }
        disabled={!involved}
      />
    </TableCell>
  )
}

export { NormalAmountTableCell }
