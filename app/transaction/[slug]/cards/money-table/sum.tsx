import { notFound } from "next/navigation"
import { getCurrency } from "@/lib/firebase/currencies"

type SumProps = {
  sum: number
  currencyId: string
}

async function Sum({ sum, currencyId }: SumProps) {
  const currency = await getCurrency(currencyId)

  if (currency === null) {
    notFound()
  }

  return (
    <div className="flex items-center w-full">
      <h2 className="ml-auto text-lg font-medium">合計</h2>
      <p className="mx-3">
        <span className="mr-1.5">{currency.symbol}</span>
        {sum.toLocaleString("ja-JP")}
      </p>
    </div>
  )
}

export { Sum }
