import { getTransactions } from "@/lib/firebase/transactions"
import { NextResponse } from "next/server"
import { Response } from "@/types/api"
import { Transaction } from "@/types/firebase"

const dynamic = "force-dynamic"

async function GET(): Promise<NextResponse<Response<Transaction[]>>> {
  const transactions = await getTransactions()

  const res: Response<Transaction[]> =
    transactions == null
      ? {
          message: "error",
        }
      : {
          message: "ok",
          data: transactions,
        }

  return NextResponse.json(res)
}

export { GET, dynamic }
