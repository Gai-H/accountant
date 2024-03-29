"use server"

import { cache } from "react"
import db from "@/lib/firebase"
import { Transaction, Transactions } from "@/types/firebase"

export const getTransactions = cache(async (): Promise<Transactions | null> => {
  const ref = db.ref("transactions")
  let transactions = null
  await ref.orderByChild("timestamp").once("value", (data) => {
    transactions = data.val() ?? {}
  })
  return transactions
})

export const getTransaction = cache(async (transactionId: string): Promise<Transaction | null> => {
  const ref = db.ref(`transactions/${transactionId}`)
  let transaction = null
  await ref.once("value", (data) => {
    transaction = data.val()
  })
  return transaction
})

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

export const updateTransaction = async (transaction: Transaction, id: string): Promise<boolean> => {
  if (id.includes("/") || !id.startsWith("-")) return false

  const ref = db.ref(`transactions/${id}`)
  await ref.set(transaction, (error) => {
    if (error) {
      console.error("Failed to update transaction: " + error)
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
