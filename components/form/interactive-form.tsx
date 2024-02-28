"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form as ShadcnForm } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import PageTitle from "@/components/page-title"
import { Currencies, Users } from "@/types/firebase"
import { insert, update } from "./actions"
import { CancelButton } from "./cancel-button"
import { CurrencyFormField, DescriptionFormField, FromFormField, TitleFormField, ToFormField } from "./fields"
import { schema } from "./schema"

type InteractiveFormProps = {
  users: Users<"displayName" | "image">
  currencies: Currencies
  defaultValues: z.infer<typeof schema>
  transactionId?: string
}

function InteractiveForm({ users, currencies, defaultValues, transactionId }: InteractiveFormProps) {
  const [sending, setSending] = useState<boolean>(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const { toast } = useToast()
  const router = useRouter()

  const insertTransaction = async (values: z.infer<typeof schema>) => {
    const res = await insert(values)
    if (res.ok) {
      toast({
        title: "記録を追加しました",
      })
      router.push("/")
    } else {
      toast({
        title: "エラーが発生しました",
        description: res.message,
        variant: "destructive",
      })
    }
  }

  const updateTransaction = async (values: z.infer<typeof schema>, transactionId: string) => {
    const res = await update(values, transactionId)
    if (res.ok) {
      toast({
        title: "記録を更新しました",
      })
      router.push("/")
    } else {
      toast({
        title: "エラーが発生しました",
        description: res.message,
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSending(true)
    if (transactionId === undefined) {
      await insertTransaction(values)
    } else {
      await updateTransaction(values, transactionId)
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
            <PageTitle>記録を{transactionId === undefined ? "追加" : "編集"}する</PageTitle>
            <div className="md:hidden">
              <AddButton
                sending={sending}
                edit={transactionId !== undefined}
              />
            </div>
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
          <div className="w-full max-w-[40em]">
            <DescriptionFormField {...form} />
          </div>
          <div className="hidden gap-2 md:mt-5 md:flex">
            <AddButton
              sending={sending}
              edit={transactionId !== undefined}
            />
            <CancelButton />
          </div>
        </fieldset>
      </form>
    </ShadcnForm>
  )
}

export { InteractiveForm }

type AddButtonProps = {
  sending: boolean
  edit: boolean
}

function AddButton({ sending, edit }: AddButtonProps) {
  return (
    <Button
      disabled={sending}
      type="submit"
      className="w-20 md:w-32"
    >
      {sending ? (
        <>
          <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
          <span className="hidden md:inline">{edit ? "更新" : "追加"}中...</span>
        </>
      ) : (
        <>
          {edit ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              更新
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              追加
            </>
          )}
        </>
      )}
    </Button>
  )
}
