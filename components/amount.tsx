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
      <span className="mr-1 inline-block">{currency === "JPY" ? "¥" : "₱"}</span>
      {colored && amount > 0 && <span className="text-green-600">{formatter.format(amount)}</span>}
      {colored && amount < 0 && <span className="text-red-600">{formatter.format(amount)}</span>}
      {(!colored || amount == 0) && <span>{formatter.format(amount)}</span>}
    </div>
  )
}

export default Amount
