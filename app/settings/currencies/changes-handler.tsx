"use client"

import { useState } from "react"
import { updateCurrencies } from "@/lib/firebase/currencies"
import { Currencies, Currency } from "@/types/firebase"
import { SavingAlert } from "../saving-alert"
import { Form } from "./form"

type ChangesHandlerProps = {
  currencies: Currencies
}

function ChangesHandler({ currencies }: ChangesHandlerProps) {
  const [changedCurrencies, setChangedCurrencies] = useState(currencies)

  const changedCurrenciesUpdater = (id: string) => {
    return (currency: Currency) => {
      setChangedCurrencies((mc) => {
        return { ...mc, [id]: currency }
      })
    }
  }

  const handleSave = async () => {
    return await updateCurrencies(changedCurrencies)
  }

  const changed = JSON.stringify(changedCurrencies) !== JSON.stringify(currencies)

  return (
    <>
      <div className="flex flex-col gap-4">
        {Object.entries(changedCurrencies).map(([id, currency]) => (
          <div key={id}>
            <h2 className="font-semibold text-xl">{id}</h2>
            <Form
              currency={currency}
              currencyId={id}
              updater={changedCurrenciesUpdater(id)}
            />
          </div>
        ))}
        {changed && <SavingAlert save={handleSave} />}
      </div>
      <SavingAlert
        save={handleSave}
        enabled={changed}
      />
    </>
  )
}

export { ChangesHandler }
