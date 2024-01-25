import useSWR from "swr"
import { Currencies } from "@/types/firebase"

type Props = {
  amount: number
  currency: string
  colored?: boolean
}

function Amount({ amount, currency, colored }: Props) {
  const { data: currencies } = useSWR<Currencies>("/api/currencies")

  const formatter = new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  return (
    <div>
      {!currencies || (currencies && !(currency in currencies)) ? <span className="mr-1 inline-block">?</span> : <span className="mr-1 inline-block">{currencies[currency].symbol}</span>}
      {colored && amount > 0 && <span className="text-green-600">{formatter.format(amount)}</span>}
      {colored && amount < 0 && <span className="text-red-600">{formatter.format(amount)}</span>}
      {(!colored || amount == 0) && <span>{formatter.format(amount)}</span>}
    </div>
  )
}

export default Amount
