import { NextRequest, NextResponse } from "next/server"
import { schema } from "@/app/settings/new-user-lock"
import { Response } from "@/types/api"
import { getNewUserLock, updateNewUserLock } from "./new-user-lock"

const dynamic = "force-dynamic"

const revalidate = 0

async function GET(): Promise<NextResponse<Response<boolean>>> {
  const newUserLock = await getNewUserLock()

  if (newUserLock == null) {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 500,
      },
    )
  }

  return NextResponse.json({
    message: "ok",
    data: newUserLock,
  })
}

async function PUT(req: NextRequest): Promise<NextResponse<Response<null, string>>> {
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

  const updated = updateNewUserLock(json["new-user-lock"])

  if (!updated) {
    return NextResponse.json(
      {
        message: "error",
        error: "failed to update new-user-lock",
      },
      {
        status: 500,
      },
    )
  }

  return NextResponse.json({
    message: "ok",
    data: null,
  })
}

export { GET, dynamic, revalidate, PUT }
