import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { AxiomRequest, withAxiom } from "next-axiom"
import { schema } from "@/app/settings/new-user-lock"
import { getNewUserLock, updateNewUserLock } from "@/lib/firebase/new-user-lock"
import { auth } from "@/lib/next-auth/auth"
import { Response } from "@/types/api"

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

const PUT = withAxiom(async (req: AxiomRequest): Promise<NextResponse<Response<null, string>>> => {
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

  const value = json["new-user-lock"]
  const updated = updateNewUserLock(value)
  revalidatePath("/", "layout")
  req.log.info("Trying to update new-user-lock", { lock: value, userId: session.user.id })
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
})

export { GET, dynamic, revalidate, PUT }
