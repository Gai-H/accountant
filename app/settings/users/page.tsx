import { notFound } from "next/navigation"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUsers } from "@/lib/firebase/users"
import { Users } from "@/types/firebase"
import { Item } from "./item"

async function Page() {
  const users = await getUsers()

  if (users === null) notFound()

  const filteredUsers: Users<"displayName" | "image"> = Object.entries(users).reduce(
    (acc, [id, user]) => {
      acc[id] = {
        displayName: user.displayName,
        image: user.image,
      }
      return acc
    },
    {} as Users<"displayName" | "image">,
  )

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ユーザ</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(filteredUsers).map(([id, user]) => (
            <Item
              key={id}
              user={user}
              userId={id}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Page
