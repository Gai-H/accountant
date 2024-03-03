import { notFound } from "next/navigation"
import { User } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Timestamp } from "@/components/timestamp"
import { getUsers } from "@/lib/firebase/users"
import type { Record } from "./types"

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

export { RecordItem }
