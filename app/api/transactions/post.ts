import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"
import { schema } from "@/app/create/form"
import { getCurrencies } from "@/lib/firebase/currencies"
import { getLock } from "@/lib/firebase/lock"
import { insertTransaction } from "@/lib/firebase/transactions"
import { getUsers } from "@/lib/firebase/users"
import { auth } from "@/lib/next-auth/auth"
import { Response } from "@/types/api"
import { Transaction } from "@/types/firebase"

async function POST(req: NextRequest): Promise<NextResponse<Response<null, string>>> {
  const session = await auth()
  if (!session) {
    return NextResponse.json(
      {
        message: "error",
        error: "not signed in",
      },
      {
        status: 401,
      },
    )
  }

  const lock = await getLock()
  if (lock == null) {
    return NextResponse.json(
      {
        message: "error",
        error: "internal server error while fetching lock",
      },
      {
        status: 500,
      },
    )
  }
  if (lock) {
    return NextResponse.json(
      {
        message: "error",
        error: "project is locked",
      },
      {
        status: 403,
      },
    )
  }

  const json = await req.json()
  if (!schema.safeParse(json).success) {
    return NextResponse.json(
      {
        message: "error",
        error: "invalid data structure",
      },
      {
        status: 400,
      },
    )
  }

  const transaction: Transaction = { ...(json as z.infer<typeof schema>), addedBy: session.user.id, timestamp: Date.now() / 1000 }
  const validationRes = await validateTransaction(transaction)
  if (!validationRes.ok) {
    return NextResponse.json(
      {
        message: "error",
        error: validationRes.error,
      },
      {
        status: 400,
      },
    )
  }

  const res = await insertTransaction(transaction)
  if (res) {
    return NextResponse.json(
      {
        message: "ok",
        data: null,
      },
      {
        status: 200,
      },
    )
  } else {
    return NextResponse.json(
      {
        message: "error",
        error: "internal server error while inserting transaction",
      },
      {
        status: 500,
      },
    )
  }
}

export { POST }

type ValidationResult =
  | {
      ok: true
    }
  | {
      ok: false
      error: string
    }

const validateTransaction = async (transaction: Transaction): Promise<ValidationResult> => {
  // check timestamp
  if (transaction.timestamp > Date.now() / 1000) {
    return {
      ok: false,
      error: "timestamp is in the future",
    }
  }

  // check currency
  const currencies = await getCurrencies()
  if (!currencies) {
    return {
      ok: false,
      error: "internal server error while fetching currencies",
    }
  }
  if (!currencies[transaction.currency]) {
    return {
      ok: false,
      error: "invalid currency",
    }
  }

  // check from and to
  const users = await getUsers()
  let fromSum = 0
  let toSum = 0
  if (!users) {
    return {
      ok: false,
      error: "internal server error while fetching users",
    }
  }
  for (const from of transaction.from) {
    if (users.filter((user) => from.id === user.id).length === 0) {
      return {
        ok: false,
        error: "invalid user in from",
      }
    }
    if (from.amount === 0) {
      return {
        ok: false,
        error: "amount is 0",
      }
    }
    fromSum += from.amount
  }
  for (const to of transaction.to) {
    if (users.filter((user) => to.id === user.id).length === 0) {
      return {
        ok: false,
        error: "invalid user in to",
      }
    }
    if (to.amount === 0) {
      return {
        ok: false,
        error: "amount is 0",
      }
    }
    toSum += to.amount
  }

  // check fromSum and toSum
  if (fromSum !== toSum) {
    return {
      ok: false,
      error: "lend amount and borrowed amount are not equal",
    }
  }
  if (fromSum === 0 || toSum === 0) {
    return {
      ok: false,
      error: "lend amount or borrowed amount is 0",
    }
  }

  return {
    ok: true,
  }
}
