"use server"

import db from "@/lib/firebase"
import { Currencies, Currency } from "@/types/firebase"

export const getCurrencies = async (): Promise<Currencies | null> => {
  const ref = db.ref("currencies")
  let currencies = null
  await ref.once("value", (data) => {
    currencies = data.val()
  })
  return currencies
}

export const updateCurrency = async (id: string, currency: Currency): Promise<boolean> => {
  const ref = db.ref(`currencies/${id}`)
  let success = false
  await ref.update(currency, (error) => {
    if (error) {
      console.error(error)
    } else {
      success = true
    }
  })
  return success
}
