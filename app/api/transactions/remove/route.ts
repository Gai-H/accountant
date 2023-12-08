import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getLock } from "@/app/api/lock/lock"
import { Response } from "@/types/api"
import { TransactionRemoveRequest } from "@/types/firebase"
import { removeTransaction } from "../transactions"

async function POST(req: NextRequest): Promise<NextResponse<Response<null, string>>> {
  const session = await getServerSession(authOptions)
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
  if (!lock) {
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

  const json: TransactionRemoveRequest = await req.json()
  if (!json.id) {
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

  const res = await removeTransaction(json.id)
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
        error: "failed to remove transaction",
      },
      {
        status: 500,
      },
    )
  }
}

export { POST }
