import { Separator } from "@/components/ui/separator"
import { TableCell } from "@/components/ui/table"
import Amount from "@/components/amount"
import { Currencies, Transactions } from "@/types/firebase"
import { getBorrowedAmount, getLendAmount } from "./calc"

type TotalAmountTableCellProps = {
  transactions: Transactions
  currencies: Currencies
  userId: string
}

function TotalAmountTableCell({ transactions, currencies, userId }: TotalAmountTableCellProps) {
  const totalAmountByCurrency: { [currencyId: string]: number } = Object.values(transactions).reduce(
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

  const sumOfTotalAmountsInJPY = Object.keys(totalAmountByCurrency).reduce((acc, currencyId) => {
    return acc + totalAmountByCurrency[currencyId] * currencies[currencyId].oneInJPY
  }, 0)

  return (
    <TableCell className="text-right">
      {Object.keys(currencies).map((currencyId) => (
        <Amount
          key={currencyId}
          amount={totalAmountByCurrency[currencyId] ?? 0}
          currency={currencyId}
          colored={true}
        />
      ))}
      <Separator className="my-2 h-[1px] w-full bg-slate-300" />
      <Amount
        amount={sumOfTotalAmountsInJPY}
        currency="JPY"
        colored={true}
      />
    </TableCell>
  )
}

export { TotalAmountTableCell }
