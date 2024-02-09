import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import currencySettingSchema from "./currencySettingSchema"

function CurrencySettingFormSkeleton() {
  const form = useForm<z.infer<typeof currencySettingSchema>>({
    resolver: zodResolver(currencySettingSchema),
    defaultValues: {
      id: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={() => {}}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="symbol"
          render={() => (
            <FormItem>
              <FormLabel>
                <Skeleton className="h-4 w-12" />
              </FormLabel>
              <FormControl>
                <Skeleton className="h-10 w-full" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oneInJPY"
          render={() => (
            <FormItem>
              <FormLabel>
                <Skeleton className="h-4 w-12" />
              </FormLabel>
              <FormControl>
                <Skeleton className="h-10 w-full" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-10 w-20 px-4 py-2" />
          <Skeleton className="h-10 w-16 px-4 py-2" />
        </div>
      </form>
    </Form>
  )
}

export { CurrencySettingFormSkeleton }
