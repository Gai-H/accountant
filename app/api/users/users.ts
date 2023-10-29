import { User } from "@/types/firebase"
import db from "@/app/api/firebase"

const CACHE_DURATION = 1000 * 60 * 3 // 3 minutes

let cache: User[] | null = null
let lastUpdated: number = 0

export const getUsers = async (): Promise<User[] | null> => {
  if (cache && Date.now() - lastUpdated <= CACHE_DURATION) {
    return cache
  }

  await updateUsers()

  return cache
}

export const updateUsers = async () => {
  const ref = db.ref("users")
  await ref.once("value", (data) => {
    const val = data.val()
    const newCache = []
    for (const key in val) {
      newCache.push(val[key])
    }
    cache = newCache
    lastUpdated = Date.now()
  })
}
