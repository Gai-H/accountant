"use server"

import { cache } from "react"
import db from "@/lib/firebase"

export const getLock = cache(async (): Promise<boolean | null> => {
  const ref = db.ref("lock")
  let lock = null
  await ref.once("value", (data) => {
    lock = data.val()
  })
  return lock
})

export const updateLock = async (lock: boolean): Promise<boolean> => {
  const ref = db.ref("lock")
  await ref.set(lock, (error) => {
    if (error) {
      console.error("Failed to update lock: " + error)
      return false
    }
  })
  return true
}
