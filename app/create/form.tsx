// TODO: コンポーネント分割する

"use client"

import { useState } from "react"
import { useController, useForm, UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as ShadcnForm } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import PageTitle from "@/components/page-title"
import { currencies } from "@/lib/currency"
import { users } from "@/lib/users"

const formSchema = z
  .object({
    title: z.string().min(1, { message: "必須項目です" }).max(100, { message: "最大100文字です" }),
    description: z.string().max(2000, { message: "最大2000文字です" }).optional(),
    currency: z.enum(currencies as any),
    from: z
      .array(
        z.object({
          discordId: z.string(),
          amount: z.number(),
        }),
      )
      .min(1, { message: "必須項目です" })
      .superRefine((values, ctx) => {
        for (const value of values) {
          if (value.discordId === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未選択の人の欄があります" })
          if (value.amount === Number.MIN_SAFE_INTEGER) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未入力の金額の欄があります" })
          if (value.amount === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "金額の欄には0以外を入力してください" })
        }
      }),
    to: z
      .array(
        z.object({
          discordId: z.string(),
          amount: z.number(),
        }),
      )
      .min(1, { message: "必須項目です" })
      .superRefine((values, ctx) => {
        for (const value of values) {
          if (value.discordId === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未選択の人の欄があります" })
          if (value.amount === Number.MIN_SAFE_INTEGER) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未入力の金額の欄があります" })
          if (value.amount === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "金額の欄には0以外を入力してください" })
        }
      }),
  })
  .refine(
    (values) => {
      const fromAmount = values.from.reduce((prev, current) => prev + current.amount, 0)
      const toAmount = values.to.reduce((prev, current) => prev + current.amount, 0)
      return fromAmount === toAmount
    },
    { message: "貸し借りの金額が一致しません", path: ["to"] },
  )

function Form() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      currency: currencies[0],
      from: [],
      to: [],
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <ShadcnForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
        autoComplete="off"
      >
        <div className="flex justify-between">
          <PageTitle>記録を追加する</PageTitle>
          <Button
            type="submit"
            className="md:hidden md:w-32"
          >
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>
        <div className="md:w-80">
          <TitleFormField {...form} />
        </div>
        <div className="w-24">
          <CurrencyFormField {...form} />
        </div>
        <FromFormField {...form} />
        <ToFormField {...form} />
        <div className="md:w-[40em]">
          <DescriptionFormField {...form} />
        </div>
        <Button
          type="submit"
          className="hidden md:mt-5 md:inline md:w-32"
        >
          追加
        </Button>
        <FormMessage />
      </form>
    </ShadcnForm>
  )
}

export default Form

const LABEL_CSS = "text-lg font-semibold text-inherit"

function TitleFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
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

function CurrencyFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
  return (
    <FormField
      control={control}
      name="currency"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CSS}>通貨</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="通貨" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem
                  value={currency}
                  key={currency}
                >
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  )
}

function FromFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
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
                  newFieldValue[index].discordId = value
                  field.onChange(newFieldValue)
                }}
                value={field.value[index].discordId}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="人" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      value={user}
                      key={`from-selectitem-${user}`}
                      disabled={field.value.some((item) => item.discordId === user)}
                    >
                      {user}
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
            disabled={field.value?.length === users.length}
            onClick={() => field.onChange([...field.value, { discordId: "", amount: Number.MIN_SAFE_INTEGER }])}
            className="block w-32"
          >
            貸す人を追加
          </Button>
        </FormItem>
      )}
    />
  )
}

function ToFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
  const { field: fromField } = useController({ name: "from" })
  const [split, setSplit] = useState<boolean>(true)

  const getSplitAmount = (numberOfToPeople: number) => {
    const fromValues: z.infer<typeof formSchema>["from"] = fromField.value
    if (fromValues.some((f) => f.amount === Number.MIN_SAFE_INTEGER)) return Number.MIN_SAFE_INTEGER
    const fromAmountSum = fromValues.reduce((prev, current) => prev + current.amount, 0)
    if (fromAmountSum === 0) return 0 // ゼロ除算
    return fromAmountSum / numberOfToPeople
  }

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
                if (checked === "indeterminate" || checked === false) {
                  // チェックが消えたとき、割り勘で入力された小数が残ると嫌なので金額をリセット
                  field.onChange(field.value.map((item) => ({ ...item, amount: Number.MIN_SAFE_INTEGER })))
                } else {
                  // チェックがついたときに割り勘する
                  const splitAmount = getSplitAmount(field.value.length)
                  field.onChange(field.value.map((item) => ({ ...item, amount: splitAmount })))
                }
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
                  newFieldValue[index].discordId = value
                  field.onChange(newFieldValue)
                }}
                value={field.value[index].discordId}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="人" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      value={user}
                      key={`from-selectitem-${user}`}
                      disabled={field.value.some((item) => item.discordId === user)}
                    >
                      {user}
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
            disabled={field.value?.length === users.length}
            onClick={() => {
              const updated = [...field.value, { discordId: "", amount: Number.MIN_SAFE_INTEGER }]
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

function DescriptionFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CSS}>説明</FormLabel>
          <FormControl>
            <Textarea
              placeholder="説明を入力"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
