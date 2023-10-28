import { getUsers } from "@/lib/firebase/username"
import { NextResponse } from "next/server"

async function GET() {
  const users = await getUsers()

  return NextResponse.json(users)
}

export { GET }
