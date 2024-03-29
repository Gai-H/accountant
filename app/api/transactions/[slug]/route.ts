import { NextResponse } from "next/server"
import { AxiomRequest, withAxiom } from "next-axiom"
import { getLock } from "@/lib/firebase/lock"
import { removeTransaction } from "@/lib/firebase/transactions"
import { auth } from "@/lib/next-auth/auth"
import { Response } from "@/types/api"

const DELETE = withAxiom(async (req: AxiomRequest, { params }: { params: { slug: string } }): Promise<NextResponse<Response<null, string>>> => {
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

  const id = params.slug
  const res = await removeTransaction(id)
  req.log.info("Trying to remove a transaction", { id, userId: session.user.id })
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
})

export { DELETE }
