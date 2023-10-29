import { Transaction } from "@/types/firebase"
import db from "@/app/api/firebase"

const CACHE_DURATION = 1000 * 60 * 3 // 3 minutes

let cache: Transaction[] | null = null
let lastUpdated: number = 0

export const getTransactions = async (): Promise<Transaction[] | null> => {
  if (cache && Date.now() - lastUpdated <= CACHE_DURATION) {
    return cache
  }

  await updateTransactions()

  return cache
}

export const updateTransactions = async () => {
  const ref = db.ref("transactions")
  await ref.orderByChild("timestamp").once("value", (data) => {
    const val = data.val()
    const newCache = []
    for (const key in val) {
      newCache.push(val[key])
    }
    cache = newCache.reverse()
    lastUpdated = Date.now()
  })
}

export const insertTransaction = async (transaction: Transaction): Promise<boolean> => {
  const ref = db.ref("transactions")
  await ref.push(transaction, (error) => {
    if (error) {
      console.error("Failed to insert transaction: " + error)
      return false
    }
  })
  await updateTransactions()
  return true
}
