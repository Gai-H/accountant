"use client"

import { useState } from "react"
import { mutate } from "swr"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Currency } from "@/types/firebase"
import { schema } from "./schema"

type CurrencySettingFormProps = {
  currency: Currency & {
    id: string
  }
}

function CurrencySettingForm({ currency }: CurrencySettingFormProps) {
  const [sending, setSending] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: currency,
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSending(true)
    const res = await fetch("/api/currencies", { method: "POST", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: `${values.id}の設定を更新しました`,
        duration: 4000,
      })
      await mutate("/api/currencies")
    } else {
      toast({
        title: "エラーが発生しました",
        description: json.error,
        variant: "destructive",
        duration: 4000,
      })
    }
    setSending(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-2"
      >
        <fieldset
          disabled={sending}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>記号</FormLabel>
                <FormControl>
                  <Input
                    className="w-16 rounded border px-2 py-1"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oneInJPY"
            disabled={currency.id === "JPY"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>1単位あたりの価値</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      className="w-16 rounded border px-2 py-1"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber
                        if (isNaN(value)) {
                          return
                        }
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <div className="text-sm">
                    JPY<span className="mx-1">/</span>
                    {currency.id}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-between">
            <Button
              type="reset"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty || sending}
            >
              リセット
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || sending}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新
                </>
              ) : (
                <>更新</>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}

export { CurrencySettingForm }
