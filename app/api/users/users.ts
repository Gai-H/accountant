import db from "@/app/api/firebase"
import { User } from "@/types/firebase"

export const getUsers = async (): Promise<User[] | null> => {
  const ref = db.ref("users")
  let users = null
  await ref.once("value", (data) => {
    const val = data.val()
    users = Object.keys(val).map((key) => ({ ...val[key], id: key }))
  })
  return users
}
