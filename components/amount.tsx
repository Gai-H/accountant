type Props = {
  amount: number
  currency: string
  colored?: boolean
}

function Amount({ amount, currency, colored }: Props) {
  const formatter = new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  return (
    <div>
      {colored && amount > 0 && <span className="mr-1 text-green-600">{formatter.format(amount)}</span>}
      {colored && amount < 0 && <span className="mr-1 text-red-600">{formatter.format(amount)}</span>}
      {(!colored || amount == 0) && <span className="mr-1">{formatter.format(amount)}</span>}
      <span className="inline-block w-7">{currency}</span>
    </div>
  )
}

export default Amount
