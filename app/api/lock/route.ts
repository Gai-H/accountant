import { NextRequest, NextResponse } from "next/server"
import schema from "@/app/settings/lock/lockSettingSchema"
import { Response } from "@/types/api"
import { getLock, updateLock } from "./lock"

const dynamic = "force-dynamic"

const revalidate = 0

async function GET(): Promise<NextResponse<Response<boolean>>> {
  const lock = await getLock()

  if (lock == null) {
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
    data: lock,
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

  const updated = updateLock(json.lock)

  if (!updated) {
    return NextResponse.json(
      {
        message: "error",
        error: "failed to update lock",
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
