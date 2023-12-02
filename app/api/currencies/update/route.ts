import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import schema from "@/app/settings/currencySettingSchema"
import { getCurrencies, updateCurrency } from "../currencies"
import { Response } from "@/types/api"
import { Currency } from "@/types/firebase"

async function POST(req: NextRequest): Promise<NextResponse<Response<null, string>>> {
  const session = await getServerSession(authOptions)
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

  const json = await req.json()
  if (!schema.safeParse(json).success) {
    return NextResponse.json(
      {
        message: "error",
        error: "invalid data structure",
      },
      {
        status: 400,
      },
    )
  }

  const { id, ...currency } = json
  const validationRes = await validateCurrency(id, currency)
  if (!validationRes.ok) {
    return NextResponse.json(
      {
        message: "error",
        error: validationRes.error,
      },
      {
        status: 400,
      },
    )
  }

  const res = await updateCurrency(id, currency)
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
        error: "internal server error while updating currncy",
      },
      {
        status: 500,
      },
    )
  }
}

export { POST }

type ValidationResult =
  | {
      ok: true
    }
  | {
      ok: false
      error: string
    }

const validateCurrency = async (id: string, currency: Currency): Promise<ValidationResult> => {
  if (id.includes("/")) {
    return {
      ok: false,
      error: "id cannot include /",
    }
  }

  if (id === "JPY" && currency.oneInJPY !== 1) {
    return {
      ok: false,
      error: "oneInJPY must be 1 for JPY",
    }
  }

  if (currency.oneInJPY <= 0) {
    return {
      ok: false,
      error: "oneInJPY must be positive",
    }
  }

  const currencies = await getCurrencies()
  if (currencies === null) {
    return {
      ok: false,
      error: "internal server error while fetching currencies",
    }
  }

  if (!(id in currencies)) {
    return {
      ok: false,
      error: `currency ${id} does not exist`,
    }
  }

  return {
    ok: true,
  }
}
