"use server"

import { revalidatePath } from "next/cache"
import { getTransactions } from "@/lib/firebase/transactions"
import { getUsers } from "@/lib/firebase/users"
import { removeUser as fbRemoveUser } from "@/lib/firebase/users"
import { auth } from "@/lib/next-auth/auth"
import { logger } from "@/lib/server-action-logger"
import { ServerActionResponse } from "@/types/server-action"

type RemoveUser = {
  logout: boolean
}

const removeUser = logger(async (id: string): Promise<ServerActionResponse<RemoveUser>> => {
  const users = await getUsers()
  const transactions = await getTransactions()
  const session = await auth()

  if (users === null || transactions === null || session === null) {
    return {
      ok: false,
      message: "削除するために必要な情報を取得できませんでした",
    }
  }

  if (!(id in users)) {
    return {
      ok: false,
      message: "ユーザが見つかりません",
    }
  }

  const doesUserHaveTransactions = Object.entries(transactions).some(([_, transaction]) => {
    if (transaction.addedBy === id) return true

    if (transaction.from.some((f) => f.id === id)) return true

    if (transaction.to.some((t) => t.id === id)) return true

    return false
  })

  if (doesUserHaveTransactions) {
    return {
      ok: false,
      message: "ユーザが関与している記録があります",
    }
  }

  const res = await fbRemoveUser(id)
  if (!res) {
    return {
      ok: false,
      message: "ユーザの削除に失敗しました",
    }
  }

  revalidatePath("/", "layout")

  return {
    ok: true,
    data: {
      logout: id === session.user.id,
    },
  }
})

export { removeUser }
