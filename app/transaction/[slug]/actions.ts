"use server"

import { revalidatePath } from "next/cache"
import { Logger } from "next-axiom"
import { removeTransaction } from "@/lib/firebase/transactions"
import { auth } from "@/lib/next-auth/auth"

const remove = async (transactionId: string): Promise<boolean> => {
  const session = await auth()
  const log = new Logger()

  const res = await removeTransaction(transactionId)
  log.info("Trying to remove a transaction", { transactionId, userId: session!.user.id })
  if (res) {
    revalidatePath(`/transaction/${transactionId}`)
    revalidatePath("/")
  }

  return res
}

export { remove }
