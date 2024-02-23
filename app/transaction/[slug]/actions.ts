"use server"

import { removeTransaction } from "@/lib/firebase/transactions"

const remove = async (transactionId: string): Promise<boolean> => {
  return await removeTransaction(transactionId)
}

export { remove }
