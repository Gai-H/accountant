import { getUsers } from "../users"
import { NextResponse } from "next/server"
import { User } from "@/types/firebase"
import { Response } from "@/types/api"

const dynamic = "force-dynamic"

async function GET(): Promise<NextResponse<Response<User[]>>> {
  const users = await getUsers()

  const res: Response<User[]> =
    users == null
      ? {
          message: "error",
        }
      : {
          message: "ok",
          data: users,
        }

  return NextResponse.json(res)
}

export { GET, dynamic }
