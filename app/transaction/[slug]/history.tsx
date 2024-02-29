import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Timestamp from "@/components/timestamp"
import { getUsers } from "@/lib/firebase/users"
import { Transaction, User } from "@/types/firebase"

type HistoryProps = {
  transaction: Transaction
}

type Record = {
  userId: string
  timestamp: number
}

async function History({ transaction }: HistoryProps) {
  const records: Record[] = [
    { userId: transaction.addedBy, timestamp: transaction.timestamp },
    ...Object.values(transaction.editHistory ?? {}).map((record) => ({ userId: record.editedBy, timestamp: record.timestamp })),
  ]

  return (
    <Card className="p-6 shadow-none min-h-[7rem] flex flex-col justify-center">
      <CardContent className="flex flex-col p-0">
        {records.map((record, idx) => (
          <div key={idx}>
            <RecordItem
              record={record}
              latest={idx === records.length - 1}
              edit={idx !== 0}
            />
            {idx !== records.length - 1 && <Separator className="w-[2px] h-4 ml-5 my-0.5" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { History }

type RecordItemProps = {
  record: Record
  latest: boolean
  edit: boolean
}

async function RecordItem({ record, latest, edit }: RecordItemProps) {
  const users = await getUsers()

  if (users === null) {
    notFound()
  }

  const user: User | undefined = users[record.userId]
  const emphasize = latest || !edit

  return (
    <div className="flex items-center">
      <Avatar className={`mr-2.5 ${!emphasize && "h-8 w-8 ml-1"}`}>
        {user === undefined ? (
          <AvatarFallback>?️</AvatarFallback>
        ) : (
          <AvatarImage
            src={user.image}
            alt={user.displayName}
          />
        )}
      </Avatar>
      <div>
        <div className={emphasize ? "text-base" : "text-sm"}>
          <span className="mr-1.5 font-medium">{user === undefined ? "unknown" : user.displayName}</span>
          によって{edit ? "編集" : "追加"}
          {latest && (
            <Badge
              variant="secondary"
              className="ml-1"
            >
              最新版
            </Badge>
          )}
        </div>
        <div className={`${emphasize ? "text-sm" : "text-xs"} text-muted-foreground`}>
          <Timestamp timestamp={record.timestamp} />
        </div>
      </div>
    </div>
  )
}
