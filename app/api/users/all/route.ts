import { getUsers } from "@/lib/firebase/username"
import { NextResponse } from "next/server"

const dynamic = "force-dynamic"

async function GET() {
  const users = await getUsers()

  return NextResponse.json(users)
}

export { GET, dynamic }
