"use client"

type Props = {
  timestamp: number
}

function Timestamp({ timestamp }: Props) {
  const date = new Date(timestamp * 1000)

  return <div>{date.toLocaleString("ja-JP", { weekday: "short", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
}

export default Timestamp
