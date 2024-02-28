import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import FormLabel from "../form-label"
import { schema } from "../schema"

type DescriptionFormFieldProps = UseFormReturn<z.infer<typeof schema>>

function DescriptionFormField({ control }: DescriptionFormFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>説明</FormLabel>
          <FormControl>
            <Textarea
              placeholder="(任意)"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { DescriptionFormField }
