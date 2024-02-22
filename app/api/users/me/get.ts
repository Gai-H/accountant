import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { getUser } from "@/lib/firebase/users"
import { Response } from "@/types/api"

const revalidate = 5

async function GET(req: NextRequest): Promise<NextResponse<Response<boolean>>> {
  const token = await getToken({ req })
  const id = token?.sub
  if (id === undefined) {
    return NextResponse.json(
      {
        message: "ok",
        data: false,
      },
      {
        status: 200,
      },
    )
  }

  const user = await getUser(id)
  return NextResponse.json(
    {
      message: "ok",
      data: user !== null,
    },
    {
      status: 200,
    },
  )
}

export { GET, revalidate }
