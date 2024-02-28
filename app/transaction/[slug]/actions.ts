"use server"

import { revalidatePath } from "next/cache"
import { getLock } from "@/lib/firebase/lock"
import { removeTransaction } from "@/lib/firebase/transactions"
import { ServerActionResponse } from "@/types/server-action"

const remove = async (transactionId: string): Promise<ServerActionResponse<null>> => {
  const lock = await getLock()
  if (lock === null || lock) {
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
}

export { remove }
