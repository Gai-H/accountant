"use server"

import { revalidatePath } from "next/cache"
import { removeTransaction } from "@/lib/firebase/transactions"

const remove = async (transactionId: string): Promise<boolean> => {
  const res = await removeTransaction(transactionId)
  if (res) {
    revalidatePath(`/transaction/${transactionId}`)
    revalidatePath("/")
  }

  return res
}

export { remove }
