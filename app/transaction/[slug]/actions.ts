"use server"

import { revalidatePath } from "next/cache"
import { getSetting } from "@/lib/firebase/settings"
import { removeTransaction } from "@/lib/firebase/transactions"
import { logger } from "@/lib/server-action-logger"
import { ServerActionResponse } from "@/types/server-action"

const remove = logger(async (transactionId: string): Promise<ServerActionResponse<null>> => {
  const newTransactionLock = await getSetting("newTransactionLock")
  if (newTransactionLock === null || newTransactionLock) {
    return {
      ok: false,
      message: "Project is locked",
    }
  }

  const res = await removeTransaction(transactionId)
  if (res) {
    revalidatePath(`/transaction/${transactionId}`)
    revalidatePath("/")
    return {
      ok: true,
      data: null,
    }
  } else {
    return {
      ok: false,
      message: "Internal server error while removing a transaction",
    }
  }
})

export { remove }
