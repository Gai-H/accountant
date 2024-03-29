"use server"

import { cache } from "react"
import db from "@/lib/firebase"

export const getNewUserLock = cache(async (): Promise<boolean | null> => {
  const ref = db.ref("new-user-lock")
  let lock = null
  await ref.once("value", (data) => {
    lock = data.val()
  })
  return lock
})

export const updateNewUserLock = async (lock: boolean): Promise<boolean> => {
  const ref = db.ref("new-user-lock")
  await ref.set(lock, (error) => {
    if (error) {
      console.error("Failed to update new-user-lock: " + error)
      return false
    }
  })
  return true
}
