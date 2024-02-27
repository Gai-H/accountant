import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getTransactions } from "@/lib/firebase/transactions"
import { removeUser } from "@/lib/firebase/users"
import { auth } from "@/lib/next-auth/auth"
import { Response } from "@/types/api"

async function DELETE(_: NextRequest, { params }: { params: { slug: string } }): Promise<NextResponse<Response<null, string>>> {
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

  const transactions = await getTransactions()
  if (transactions == null) {
    return NextResponse.json(
      {
        message: "error",
        error: "internal server error while fetching transactions",
      },
      {
        status: 500,
      },
    )
  }

  const id = params.slug
  const hasTransactions = Object.values(transactions).some((t) => {
    return t.from.some((f) => f.id === id) || t.to.some((t) => t.id === id)
  })
  if (hasTransactions) {
    return NextResponse.json(
      {
        message: "error",
        error: "user has transactions",
      },
      {
        status: 400,
      },
    )
  }

  const res = await removeUser(id)
  revalidatePath("/", "layout")
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
        error: "failed to remove user",
      },
      {
        status: 500,
      },
    )
  }
}

export { DELETE }
