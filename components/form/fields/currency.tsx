import { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Currencies } from "@/types/firebase"
import FormLabel from "../form-label"
import { schema } from "../schema"

type CurrencyFormFieldProps = UseFormReturn<z.infer<typeof schema>> & {
  currencies: Currencies
}

function CurrencyFormField({ control, currencies }: CurrencyFormFieldProps) {
  return (
    <FormField
      control={control}
      name="currency"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>通貨</FormLabel>
            <FormMessage />
          </div>
          <div className="md:w-32">
            <CurrencySelect
              field={field}
              currencies={currencies}
            />
          </div>
        </FormItem>
      )}
    />
  )
}

export { CurrencyFormField }

type CurrencySelectProps = {
  field: ControllerRenderProps<z.infer<typeof schema>, "currency">
  currencies: Currencies
}

function CurrencySelect({ field, currencies }: CurrencySelectProps) {
  return (
    <Select
      onValueChange={(value) => field.onChange(value)}
      value={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {Object.keys(currencies).map((currency) => (
          <SelectItem
            value={currency}
            key={currency}
          >
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
