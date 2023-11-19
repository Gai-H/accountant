import db from "@/app/api/firebase"
import { Currencies } from "@/types/firebase"

export const getCurrencies = async (): Promise<Currencies | null> => {
  const ref = db.ref("currencies")
  let currencies = null
  await ref.once("value", (data) => {
    currencies = data.val()
  })
  return currencies
}
