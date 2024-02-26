import { notFound } from "next/navigation"
import { getCurrencies } from "@/lib/firebase/currencies"

type Props = {
  amount: number
  currency: string
  colored?: boolean
}

async function Amount({ amount, currency, colored }: Props) {
  const currencies = await getCurrencies()

  if (currencies === null) {
    notFound()
  }

  const formatter = new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  return (
    <div>
      <span className="inline-block mr-1">{currencies[currency].symbol}</span>
      {colored && amount > 0 && <span className="text-green-600">{formatter.format(amount)}</span>}
      {colored && amount < 0 && <span className="text-red-600">{formatter.format(amount)}</span>}
      {(!colored || amount == 0) && <span>{formatter.format(amount)}</span>}
    </div>
  )
}

export default Amount
