import { NextResponse } from "next/server"
import { Response } from "@/types/api"
import { UsersGetResponse } from "@/types/firebase"
import { getUsers } from "./users"

const dynamic = "force-dynamic"

const revalidate = 0

async function GET(): Promise<NextResponse<Response<UsersGetResponse>>> {
  const users = await getUsers()

  if (users == null) {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 500,
      },
    )
  }

  const res: UsersGetResponse = {}
  users.forEach(({ id, displayName, image }) => {
    res[id] = { displayName, image }
  })

  return NextResponse.json(
    {
      message: "ok",
      data: res,
    },
    {
      status: 200,
    },
  )
}

export { GET, dynamic, revalidate }
