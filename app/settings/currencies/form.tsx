"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Currency } from "@/types/firebase"

type FormProps = {
  currency: Currency
  currencyId: string
  updater: (currency: Currency) => void
}

function Form({ currency, currencyId, updater }: FormProps) {
  const inputSymbolId = `input-symbol-${currencyId}`
  const inputOneInJPYId = `input-oneInJPY-${currencyId}`

  return (
    <div className="flex md:gap-8 gap-2 flex-col md:flex-row">
      <div>
        <Label htmlFor={inputSymbolId}>記号</Label>
        <Input
          id={inputSymbolId}
          value={currency.symbol}
          onChange={(e) => updater({ ...currency, symbol: e.target.value })}
          className="mt-1 w-20"
        />
      </div>
      <div>
        <Label htmlFor={inputOneInJPYId}>レート</Label>
        <div className="flex gap-2 items-center">
          <Input
            id={inputOneInJPYId}
            value={currency.oneInJPY}
            onChange={(e) => updater({ ...currency, oneInJPY: Number(e.target.value) })}
            className="mt-1 w-28"
            type="number"
            disabled={currencyId === "JPY"}
          />
          <p className="text-sm">
            JPY<span className="mx-1">/</span>
            {currencyId}
          </p>
        </div>
      </div>
    </div>
  )
}

export { Form }
