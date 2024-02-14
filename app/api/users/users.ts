import db from "@/app/api/firebase"
import { User } from "@/types/firebase"

export const getUsers = async (): Promise<User[] | null> => {
  const ref = db.ref("users")
  let users = null
  await ref.once("value", (data) => {
    const val = data.val()
    users = val == null ? [] : Object.keys(val).map((key) => ({ ...val[key], id: key }))
  })
  return users
}

export const getUser = async (id: string): Promise<User | null> => {
  const ref = db.ref(`users/${id}`)
  let users = null
  await ref.once("value", (data) => {
    users = data.val()
  })
  return users
}

export const removeUser = async (id: string): Promise<boolean> => {
  if (id.includes("/")) return false

  const ref = db.ref(`users/${id}`)
  await ref.remove((error) => {
    if (error) {
      console.error("Failed to remove user: " + error)
      return false
    }
  })
  return true
}
