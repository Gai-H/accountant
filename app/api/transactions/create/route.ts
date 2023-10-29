import { insertTransaction } from "../transactions"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { Response } from "@/types/api"
import schema from "@/app/create/schema"
import * as z from "zod"
import { Transaction } from "@/types/firebase"

async function POST(req: NextRequest): Promise<NextResponse<Response<null>>> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 401,
      },
    )
  }

  const json = await req.json()
  if (!schema.safeParse(json).success) {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 400,
      },
    )
  }
  const transaction: Transaction = { ...(json as z.infer<typeof schema>), addedBy: session.user.name as string, timestamp: Date.now() / 1000 }

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
      },
      {
        status: 500,
      },
    )
  }
}

export { POST }
