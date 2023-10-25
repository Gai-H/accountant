"use client"

import { useForm, UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as ShadcnForm } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { currencies } from "@/lib/currency"
import { users } from "@/lib/users"

const formSchema = z.object({
  title: z.string().min(1, { message: "必須項目です" }).max(100, { message: "最大100文字です" }),
  description: z.string().max(2000, { message: "最大2000文字です" }).optional(),
  amount: z.number({ invalid_type_error: "数値を入力してください", required_error: "必須項目です", coerce: true }),
  currency: z.enum(currencies as any),
  from: z.array(z.string()).min(1, { message: "必須項目です" }),
  to: z.array(z.string()).min(1, { message: "必須項目です" }),
})

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
          <h1 className="text-2xl font-bold">記録を追加する</h1>
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
        <div className="md:w-80">
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <AmountFormField {...form} />
            </div>
            <div className="w-24 shrink-0">
              <CurrencyFormField {...form} />
            </div>
          </div>
        </div>
        <UserSelectFormField
          {...form}
          name="from"
        />
        <UserSelectFormField
          {...form}
          name="to"
        />
        <div className="md:w-[40em]">
          <DescriptionFormField {...form} />
        </div>
        <Button
          type="submit"
          className="hidden md:mt-5 md:inline md:w-32"
        >
          追加
        </Button>
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

function AmountFormField({ control }: UseFormReturn<z.infer<typeof formSchema>>) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className={LABEL_CSS}>金額</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Input
              {...field}
              type="number"
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
          <FormLabel className={LABEL_CSS}></FormLabel>
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

type UserSelectFormFieldProps = UseFormReturn<z.infer<typeof formSchema>> & {
  name: "from" | "to"
}

function UserSelectFormField({ control, name }: UserSelectFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className={LABEL_CSS}>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
            <FormMessage />
          </div>
          {users.map((user) => (
            <FormField
              key={user}
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={user}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(user)}
                        onCheckedChange={(checked) => {
                          return checked ? field.onChange([...field.value, user]) : field.onChange(field.value?.filter((value) => value !== user))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-inherit">{user}</FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
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
