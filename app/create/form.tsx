"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { UseFormReturn, useController, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as ShadcnForm } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import PageTitle from "@/components/page-title"
import { Currencies, UsersAllResponse } from "@/types/firebase"
import schema from "./schema"

const defaultValues: z.infer<typeof schema> = {
  title: "",
  description: "",
  from: [],
  to: [],
  currency: "",
}

function Form() {
  const [sending, setSending] = useState<boolean>(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const { data: users, error: usersError, isLoading: usersIsLoading } = useSWR<UsersAllResponse>("/api/users/all")
  const { data: currencies, error: currenciesError, isLoading: currenciesIsLoading } = useSWR<Currencies>("/api/currencies/all")
  const { toast } = useToast()
  const router = useRouter()

  if (usersError || currenciesError) return <div className="text-center">Failed to Load</div>

  if (usersIsLoading || currenciesIsLoading || !users || !currencies) return <div className="text-center">Loading...</div>

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSending(true)
    const res = await fetch("/api/transactions/create", { method: "POST", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: "記録を追加しました",
      })
      await mutate("/api/transactions/all")
      router.push("/")
    } else {
      toast({
        title: "エラーが発生しました",
        description: json.error,
        variant: "destructive",
      })
    }
    setSending(false)
  }

  return (
    <ShadcnForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <fieldset
          disabled={sending}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between">
            <PageTitle>記録を追加する</PageTitle>
            <Button
              disabled={sending}
              type="submit"
              className="md:hidden md:w-32"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  追加中...
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  追加
                </>
              )}
            </Button>
          </div>
          <div className="md:w-80">
            <TitleFormField {...form} />
          </div>
          <CurrencyFormField
            {...form}
            currencies={currencies}
          />
          <FromFormField
            {...form}
            users={users}
          />
          <ToFormField
            {...form}
            users={users}
          />
          <div className="md:w-[40em]">
            <DescriptionFormField {...form} />
          </div>
          <div className="hidden md:mt-5 md:block">
            <Button
              disabled={sending}
              type="submit"
              className="w-32"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  追加中...
                </>
              ) : (
                <>追加</>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </ShadcnForm>
  )
}

export default Form

const LABEL_CSS = "text-lg font-semibold text-inherit"

function TitleFormField({ control }: UseFormReturn<z.infer<typeof schema>>) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className={LABEL_CSS}>項目名</FormLabel>
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
            <FormLabel className={LABEL_CSS}>通貨</FormLabel>
            <FormMessage />
          </div>
          <div className="md:w-32">
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="通貨" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                ref={(ref) => {
                  if (!ref) return
                  ref.ontouchstart = (e) => {
                    e.preventDefault()
                  }
                }}
              >
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
          </div>
        </FormItem>
      )}
    />
  )
}

type FromFormFieldProps = UseFormReturn<z.infer<typeof schema>> & {
  users: UsersAllResponse
}

function FromFormField({ control, users }: FromFormFieldProps) {
  return (
    <FormField
      control={control}
      name="from"
      render={({ field }) => (
        <FormItem>
          {/* <p>{JSON.stringify(field.value)}</p> */}
          <div className="flex items-center gap-2">
            <FormLabel className={LABEL_CSS}>貸す人</FormLabel>
            <FormMessage />
          </div>
          {field.value.map((_, index) => (
            <div
              key={`from-div-${index}`}
              className="flex gap-2"
            >
              <Select
                key={`from-select-${index}`}
                onValueChange={(value) => {
                  const newFieldValue = [...field.value]
                  newFieldValue[index].id = value
                  field.onChange(newFieldValue)
                }}
                value={field.value[index].id}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="人" />
                </SelectTrigger>
                <SelectContent
                  ref={(ref) => {
                    if (!ref) return
                    ref.ontouchstart = (e) => {
                      e.preventDefault()
                    }
                  }}
                >
                  {Object.keys(users).map((id) => (
                    <SelectItem
                      value={id}
                      key={`from-selectitem-${id}`}
                      disabled={field.value.some((item) => item.id === id)}
                    >
                      {users[id].global_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={field.value[index].amount === Number.MIN_SAFE_INTEGER ? "" : field.value[index].amount}
                placeholder="金額"
                className="w-32"
                onChange={(e) => {
                  const newFieldValue = [...field.value]
                  newFieldValue[index].amount = e.target.value.length === 0 ? Number.MIN_SAFE_INTEGER : Number(e.target.value)
                  field.onChange(newFieldValue)
                }}
              />
              <Button
                size="icon"
                variant="destructive"
                type="button"
                onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4"></Trash2>
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            type="button"
            disabled={field.value?.length === Object.keys(users).length}
            onClick={() => field.onChange([...field.value, { id: "", amount: Number.MIN_SAFE_INTEGER }])}
            className="block w-32"
          >
            貸す人を追加
          </Button>
        </FormItem>
      )}
    />
  )
}

type ToFormFieldProps = UseFormReturn<z.infer<typeof schema>> & {
  users: UsersAllResponse
}

function ToFormField({ control, users }: ToFormFieldProps) {
  const fromFieldValue = useWatch<z.infer<typeof schema>, "from">({ name: "from" })
  const { field: toField } = useController<z.infer<typeof schema>, "to">({ name: "to" })
  const [split, setSplit] = useState<boolean>(true)

  const getSplitAmount = (numberOfToPeople: number) => {
    const fromValues: z.infer<typeof schema>["from"] = fromFieldValue
    if (fromValues.some((f) => f.amount === Number.MIN_SAFE_INTEGER)) return Number.MIN_SAFE_INTEGER
    const fromAmountSum = fromValues.reduce((prev, current) => prev + current.amount, 0)
    if (fromAmountSum === 0) return 0 // ゼロ除算
    return fromAmountSum / numberOfToPeople
  }

  useEffect(() => {
    if (split) {
      const splitAmount = getSplitAmount(toField.value.length)
      toField.onChange(toField.value.map((item) => ({ ...item, amount: splitAmount })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromFieldValue])

  useEffect(() => {
    if (split) {
      const splitAmount = getSplitAmount(toField.value.length)
      toField.onChange(toField.value.map((item) => ({ ...item, amount: splitAmount })))
    } else {
      toField.onChange(toField.value.map((item) => ({ ...item, amount: Number.MIN_SAFE_INTEGER })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [split])

  return (
    <FormField
      control={control}
      name="to"
      render={({ field }) => (
        <FormItem>
          {/* <p>{JSON.stringify(field.value)}</p> */}
          <div className="flex items-center gap-2">
            <FormLabel className={LABEL_CSS}>借りる人</FormLabel>
            <FormMessage />
          </div>
          <div className="flex w-fit items-center gap-2 rounded-md border px-3 py-3">
            <Checkbox
              id="to-checkbox-split"
              checked={split}
              onCheckedChange={(checked) => {
                setSplit(checked === "indeterminate" ? false : checked)
              }}
            />
            <label
              htmlFor="to-checkbox-split"
              className="cursor-pointer text-sm font-medium leading-none"
            >
              割り勘する
            </label>
          </div>
          {field.value.map((_, index) => (
            <div
              key={`from-div-${index}`}
              className="flex gap-2"
            >
              <Select
                key={`from-select-${index}`}
                onValueChange={(value) => {
                  const newFieldValue = [...field.value]
                  newFieldValue[index].id = value
                  field.onChange(newFieldValue)
                }}
                value={field.value[index].id}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="人" />
                </SelectTrigger>
                <SelectContent
                  ref={(ref) => {
                    if (!ref) return
                    ref.ontouchstart = (e) => {
                      e.preventDefault()
                    }
                  }}
                >
                  {Object.keys(users).map((id) => (
                    <SelectItem
                      value={id}
                      key={`to-selectitem-${id}`}
                      disabled={field.value.some((item) => item.id === id)}
                    >
                      {users[id].global_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={field.value[index].amount === Number.MIN_SAFE_INTEGER ? "" : field.value[index].amount}
                placeholder="金額"
                className="w-32"
                onChange={(e) => {
                  if (split) return
                  const newFieldValue = [...field.value]
                  newFieldValue[index].amount = e.target.value.length === 0 ? Number.MIN_SAFE_INTEGER : Number(e.target.value)
                  field.onChange(newFieldValue)
                }}
                disabled={split}
              />
              <Button
                size="icon"
                variant="destructive"
                type="button"
                onClick={() => {
                  const removed = field.value.filter((_, i) => i !== index)
                  if (split) {
                    const splitAmount = getSplitAmount(removed.length)
                    field.onChange(removed.map((item) => ({ ...item, amount: splitAmount })))
                  } else {
                    field.onChange(removed)
                  }
                }}
              >
                <Trash2 className="h-4 w-4"></Trash2>
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            type="button"
            disabled={field.value?.length === Object.keys(users).length}
            onClick={() => {
              const updated = [...field.value, { id: "", amount: Number.MIN_SAFE_INTEGER }]
              if (split) {
                const splitAmount = getSplitAmount(updated.length)
                field.onChange(updated.map((item) => ({ ...item, amount: splitAmount })))
              } else {
                field.onChange(updated)
              }
            }}
            className="block w-32"
          >
            貸りる人を追加
          </Button>
        </FormItem>
      )}
    />
  )
}

function DescriptionFormField({ control }: UseFormReturn<z.infer<typeof schema>>) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CSS}>説明</FormLabel>
          <FormControl>
            <Textarea
              placeholder="説明を入力 (任意)"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
