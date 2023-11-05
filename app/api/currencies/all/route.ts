import { getCurrencies } from "../currencies"
import { NextResponse } from "next/server"
import { Currencies } from "@/types/firebase"
import { Response } from "@/types/api"

const dynamic = "force-dynamic"

async function GET(): Promise<NextResponse<Response<Currencies>>> {
  const currencies = await getCurrencies()

  if (currencies == null) {
    return NextResponse.json(
      {
        message: "error",
      },
      {
        status: 500,
      },
    )
  }

  return NextResponse.json(
    {
      message: "ok",
      data: currencies,
    },
    {
      status: 200,
    },
  )
}

export { GET, dynamic }
