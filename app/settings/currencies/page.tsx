import { notFound } from "next/navigation"
import { getCurrencies } from "@/lib/firebase/currencies"
import { ChangesHandler } from "./changes-handler"

async function Page() {
  const currencies = await getCurrencies()

  if (currencies === null) {
    notFound()
  }

  return <ChangesHandler currencies={currencies} />
}

export default Page
