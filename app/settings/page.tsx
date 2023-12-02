"use client"

import { ReactNode, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWR, { mutate } from "swr"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import PageTitle from "@/components/page-title"
import currencySettingSchema from "./currencySettingSchema"
import { Currencies, Currency } from "@/types/firebase"

function Settings() {
  return (
    <>
      <PageTitle>プロジェクト設定</PageTitle>
      <CurrencySettingSection />
    </>
  )
}

export default Settings

type SectionTitleProps = {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-2 text-xl font-semibold text-inherit">{children}</h2>
}

function CurrencySettingSection() {
  const { data: currencies, error, isLoading } = useSWR<Currencies>("/api/currencies/all")

  if (error) {
    return (
      <section>
        <SectionTitle>通貨設定</SectionTitle>
        <p>Failed to load currencies</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section>
        <SectionTitle>通貨設定</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <CurrencySettingCard
              loading
              key={i}
            />
          ))}
        </div>
      </section>
    )
  }

  const propCurrencies = Object.entries(currencies ?? {}).map(([id, currency]) => ({
    id,
    ...currency,
  }))

  return (
    <section>
      <SectionTitle>通貨設定</SectionTitle>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {propCurrencies.map((pc, i) => (
          <CurrencySettingCard
            currency={pc}
            key={i}
          />
        ))}
      </div>
    </section>
  )
}

type CurrencySettingCardProps =
  | {
      currency: Currency & {
        id: string
      }
    }
  | {
      loading: true
    }

function CurrencySettingCard(props: CurrencySettingCardProps) {
  if ("loading" in props) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Skeleton className="h-6 w-12" />
          </CardTitle>
          <CardContent className="p-0">
            <CurrencySettingFormSkeleton />
          </CardContent>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{props.currency.id}</CardTitle>
        <CardContent className="p-0">
          <CurrencySettingForm currency={props.currency} />
        </CardContent>
      </CardHeader>
    </Card>
  )
}

type CurrencySettingFormProps = {
  currency: Currency & {
    id: string
  }
}

function CurrencySettingForm({ currency }: CurrencySettingFormProps) {
  const [sending, setSending] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof currencySettingSchema>>({
    resolver: zodResolver(currencySettingSchema),
    values: currency,
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const onSubmit = async (values: z.infer<typeof currencySettingSchema>) => {
    setSending(true)
    const res = await fetch("/api/currencies/update", { method: "POST", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: `${values.id}の設定を更新しました`,
        duration: 4000,
      })
      await mutate("/api/currencies/all")
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
              variant="ghost"
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
