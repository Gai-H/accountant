import { NextResponse } from "next/server"
import { Response } from "@/types/api"
import { UsersAllResponse } from "@/types/firebase"
import { getUsers } from "../users"

const dynamic = "force-dynamic"

const revalidate = 0

async function GET(): Promise<NextResponse<Response<UsersAllResponse>>> {
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

  const res: UsersAllResponse = {}
  users.forEach(({ id, global_name, image_url }) => {
    res[id] = { global_name, image_url }
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
