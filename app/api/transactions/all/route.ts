import { getTransactions } from "@/lib/firebase/transactions"
import { NextResponse } from "next/server"

async function GET() {
  const transactions = await getTransactions()

  return NextResponse.json(transactions)
}

export { GET }
