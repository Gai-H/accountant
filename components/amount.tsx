type Props = {
  amount: number
  currency: string
}

function Amount({ amount, currency }: Props) {
  const formatter = new Intl.NumberFormat("ja-JP")

  return (
    <div>
      <span className="mr-1">{formatter.format(amount)}</span>
      {currency}
    </div>
  )
}

export default Amount
