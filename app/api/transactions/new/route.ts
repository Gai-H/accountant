import { insertTransaction } from "../transactions"
import { Transaction } from "@/types/firebase"
import { NextRequest, NextResponse } from "next/server"

async function POST(req: NextRequest) {
  const transaction: Transaction = await req.json()

  const res = await insertTransaction(transaction)

  if (res) {
    return NextResponse.json(
      {
        message: "ok",
      },
      {
        status: 200,
      },
    )
  } else {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 500,
      },
    )
  }
}

export { POST }
