import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import Avatar from "../avatar"
import Timestamp from "../timestamp"
import Amount from "../amount"

type Payment = {
  timestamp: number
  title: string
  amount: number
  currency: string
  from: string
  to: string
}

type Response = {
  message: string
  data?: Payment[]
}

async function getData(): Promise<Response> {
  const res = await fetch("https://script.google.com/macros/s/AKfycbwp6jG58oHrgrs06Cqot6g13-vtYhMCVFy2YLg4te5i8q8PQDjwz6AiJOoyHYJXUirsNQ/exec")

  if (!res.ok) {
    return {
      message: "Failed to fetch data",
    }
  }

  return res.json()
}

type AvatarsProps = {
  names: string
}

function Avatars({ names }: AvatarsProps) {
  return (
    <div className="flex gap-2">
      {names.split(",").map((name) => (
        <Avatar
          key={name}
          name={name}
        />
      ))}
    </div>
  )
}

async function MainTable() {
  const data = await getData()

  return (
    <>
      {data.data ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>時間</TableHead>
                <TableHead>項目</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((row) => (
                <TableRow key={row.timestamp}>
                  <TableCell>
                    <Timestamp timestamp={row.timestamp} />
                  </TableCell>
                  <TableCell className="shrink-0 font-semibold">
                    <div>{row.title}</div>
                  </TableCell>
                  <TableCell>
                    <Amount
                      amount={row.amount}
                      currency={row.currency}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatars names={row.from} />
                  </TableCell>
                  <TableCell>
                    <Avatars names={row.to} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center">{data.message}</div>
      )}
    </>
  )
}

export default MainTable
