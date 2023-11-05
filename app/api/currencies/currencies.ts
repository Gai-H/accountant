import db from "@/app/api/firebase"
import { Currencies } from "@/types/firebase"

const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

let cache: Currencies | null = null
let lastUpdated: number = 0

export const getCurrencies = async (): Promise<Currencies | null> => {
  if (cache && Date.now() - lastUpdated <= CACHE_DURATION) {
    return cache
  }

  await updateCurrencies()

  return cache
}

export const updateCurrencies = async () => {
  const ref = db.ref("currencies")
  await ref.once("value", (data) => {
    cache = data.val()
    lastUpdated = Date.now()
  })
}
