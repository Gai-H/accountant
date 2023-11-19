import { Transaction, Transactions } from "@/types/firebase"
import db from "@/app/api/firebase"

export const getTransactions = async (): Promise<Transactions | null> => {
  const ref = db.ref("transactions")
  let transactions = null
  await ref.orderByChild("timestamp").once("value", (data) => {
    transactions = data.val()
  })
  return transactions
}

export const insertTransaction = async (transaction: Transaction): Promise<boolean> => {
  const ref = db.ref("transactions")
  await ref.push(transaction, (error) => {
    if (error) {
      console.error("Failed to insert transaction: " + error)
      return false
    }
  })
  return true
}

export const removeTransaction = async (id: string): Promise<boolean> => {
  if (id.includes("/") || !id.startsWith("-")) return false

  const ref = db.ref(`transactions/${id}`)
  await ref.remove((error) => {
    if (error) {
      console.error("Failed to remove transaction: " + error)
      return false
    }
  })
  return true
}
