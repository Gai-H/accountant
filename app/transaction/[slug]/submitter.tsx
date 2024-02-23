import { notFound } from "next/navigation"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Timestamp from "@/components/timestamp"
import { getUser } from "@/lib/firebase/users"

type SubmitterProps = {
  userId: string
  timestamp: number
}

async function Submitter({ userId, timestamp }: SubmitterProps) {
  const user = await getUser(userId)

  if (user === null) {
    notFound()
  }

  return (
    <Card className="p-6 shadow-none max-h-28">
      <CardContent className="flex items-center h-full p-0">
        <Avatar className="mr-2.5">
          <AvatarImage
            src={user.image}
            alt={user.displayName}
          />
        </Avatar>
        <div>
          <p>
            <span className="mr-1.5 font-medium">{user.displayName}</span>によって追加
          </p>
          <div className="text-sm text-muted-foreground">
            <Timestamp timestamp={timestamp} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { Submitter }
