import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormLabel from "../form-label"
import { schema } from "../schema"

function TitleFormField({ control }: UseFormReturn<z.infer<typeof schema>>) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>項目名</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export { TitleFormField }
