"use server"

import { revalidatePath } from "next/cache"
import { schema } from "."
import { z } from "zod"
import { getCurrencies } from "@/lib/firebase/currencies"
import { getSetting } from "@/lib/firebase/settings"
import { getTransaction, insertTransaction, updateTransaction } from "@/lib/firebase/transactions"
import { getUsersArray } from "@/lib/firebase/users"
import { auth } from "@/lib/next-auth/auth"
import { logger } from "@/lib/server-action-logger"
import { Transaction } from "@/types/firebase"
import { ServerActionResponse } from "@/types/server-action"

type FormValue = z.infer<typeof schema>

const insert = logger(async (formValue: FormValue): Promise<ServerActionResponse<null>> => {
  const session = await auth()

  if (!session) {
    return {
      ok: false,
      message: "Not signed in",
    }
  }

  const newTransactionLock = await getSetting("newTransactionLock")
  if (newTransactionLock === null || newTransactionLock) {
    return {
      ok: false,
      message: "Project is locked",
    }
  }

  if (!schema.safeParse(formValue).success) {
    return {
      ok: false,
      message: "Invalid data structure",
    }
  }

  const transaction: Transaction = { ...formValue, addedBy: session.user.id, timestamp: Date.now() / 1000 }
  const validationResult = await validateTransaction(transaction)
  if (!validationResult.ok) {
    return validationResult
  }

  const insertionResult = await insertTransaction(transaction)
  revalidatePath("/")

  if (insertionResult) {
    return {
      ok: true,
      data: null,
    }
  } else {
    return {
      ok: false,
      message: "Internal server error while inserting a transaction",
    }
  }
})

const update = logger(async (formValue: FormValue, transactionId: string): Promise<ServerActionResponse<null>> => {
  const session = await auth()

  if (!session) {
    return {
      ok: false,
      message: "Not signed in",
    }
  }

  const newTransactionLock = await getSetting("newTransactionLock")
  if (newTransactionLock === null || newTransactionLock) {
    return {
      ok: false,
      message: "Project is locked",
    }
  }

  if (!schema.safeParse(formValue).success) {
    return {
      ok: false,
      message: "Invalid data structure",
    }
  }

  const target = await getTransaction(transactionId)
  if (target === null) {
    return {
      ok: false,
      message: "Transaction not found",
    }
  }

  const updatedEditHistory: Transaction["editHistory"] = {
    ...target.editHistory,
    [`${Date.now()}-${session.user.id}`]: {
      timestamp: Date.now() / 1000,
      editedBy: session.user.id,
    },
  }
  const updatedTransaction: Transaction = {
    ...target,
    title: formValue.title,
    description: formValue.description,
    from: formValue.from,
    to: formValue.to,
    currency: formValue.currency,
    editHistory: updatedEditHistory,
  }

  const validationResult = await validateTransaction(updatedTransaction)
  if (!validationResult.ok) {
    return validationResult
  }

  const updateResult = await updateTransaction(updatedTransaction, transactionId)
  revalidatePath("/")

  if (updateResult) {
    return {
      ok: true,
      data: null,
    }
  } else {
    return {
      ok: false,
      message: "Internal server error while updating a transaction",
    }
  }
})

export { insert, update }

type ValidationResult =
  | {
      ok: true
    }
  | {
      ok: false
      message: string
    }

const validateTransaction = async (transaction: Transaction): Promise<ValidationResult> => {
  // check timestamp
  if (transaction.timestamp > Date.now() / 1000) {
    return {
      ok: false,
      message: "Timestamp is in the future",
    }
  }

  // check currency
  const currencies = await getCurrencies()
  if (!currencies) {
    return {
      ok: false,
      message: "Internal server error while fetching currencies",
    }
  }
  if (!currencies[transaction.currency]) {
    return {
      ok: false,
      message: "Invalid currency",
    }
  }

  // check from and to
  const users = await getUsersArray()
  let fromSum = 0
  let toSum = 0
  if (!users) {
    return {
      ok: false,
      message: "Internal server error while fetching users",
    }
  }
  for (const from of transaction.from) {
    if (users.filter((user) => from.id === user.id).length === 0) {
      return {
        ok: false,
        message: "Invalid user in from",
      }
    }
    if (from.amount === 0) {
      return {
        ok: false,
        message: "Amount is 0",
      }
    }
    fromSum += from.amount
  }
  for (const to of transaction.to) {
    if (users.filter((user) => to.id === user.id).length === 0) {
      return {
        ok: false,
        message: "Invalid user in to",
      }
    }
    if (to.amount === 0) {
      return {
        ok: false,
        message: "Amount is 0",
      }
    }
    toSum += to.amount
  }

  // check fromSum and toSum
  if (fromSum !== toSum) {
    return {
      ok: false,
      message: "Lend amount and borrowed amount are not equal",
    }
  }
  if (fromSum === 0 || toSum === 0) {
    return {
      ok: false,
      message: "Lend amount or borrowed amount is 0",
    }
  }

  return {
    ok: true,
  }
}
