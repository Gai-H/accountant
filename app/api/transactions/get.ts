import { NextResponse } from "next/server"
import { Response } from "@/types/api"
import { Transactions } from "@/types/firebase"
import { getTransactions } from "./transactions"

const dynamic = "force-dynamic"

const revalidate = 0

async function GET(): Promise<NextResponse<Response<Transactions>>> {
  const transactions = await getTransactions()

  const res: Response<Transactions> =
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

export { GET, dynamic, revalidate }
