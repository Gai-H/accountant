import { NextResponse } from "next/server"
import { getCurrencies } from "@/lib/firebase/currencies"
import { Response } from "@/types/api"
import { Currencies } from "@/types/firebase"

const dynamic = "force-dynamic"

const revalidate = 0

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

export { GET, dynamic, revalidate }
