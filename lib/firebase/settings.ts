"use server"

import { cache } from "react"
import db from "@/lib/firebase"
import { Settings } from "@/types/firebase"
import { isIdValid } from "./sanitizer"

export const getSettings = cache(async (): Promise<Settings | null> => {
  const ref = db.ref("settings")
  let settings = null
  await ref.once("value", (data) => {
    settings = data.val()
  })
  return settings
})

export const getSetting = async <T extends keyof Settings>(id: T): Promise<Settings[T] | null> => {
  const settings = await getSettings()
  return settings?.[id] ?? null
}

export const updateSetting = async <K extends keyof Settings>(id: K, value: Settings[K]): Promise<boolean> => {
  if (!isIdValid(id)) return false

  const ref = db.ref(`settings/${id}`)
  let success = true
  await ref.set(value, (error) => {
    if (error) {
      console.error(error)
      success = false
    }
  })
  return success
}
