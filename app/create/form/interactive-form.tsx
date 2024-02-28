"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form as ShadcnForm } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import PageTitle from "@/components/page-title"
import { Currencies, Users, UsersGetResponse } from "@/types/firebase"
import { CurrencyFormField, DescriptionFormField, FromFormField, TitleFormField, ToFormField } from "./fields"
import { schema } from "./schema"

type InteractiveFormProps = {
  users: Users<"displayName" | "image">
  currencies: Currencies
}

const defaultValues: z.infer<typeof schema> = {
  title: "",
  description: "",
  from: [{ id: "", amount: Number.MIN_SAFE_INTEGER }],
  to: [{ id: "", amount: Number.MIN_SAFE_INTEGER }],
  currency: "",
}

function InteractiveForm({ users, currencies }: InteractiveFormProps) {
  const [sending, setSending] = useState<boolean>(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSending(true)
    const res = await fetch("/api/transactions", { method: "POST", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: "記録を追加しました",
      })
      await mutate("/api/transactions")
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
            <div className="md:hidden">
              <AddButton sending={sending} />
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
          <div className="hidden md:mt-5 md:block">
            <AddButton sending={sending} />
          </div>
        </fieldset>
      </form>
    </ShadcnForm>
  )
}

export { InteractiveForm }

type AddButtonProps = {
  sending: boolean
}

function AddButton({ sending }: AddButtonProps) {
  return (
    <Button
      disabled={sending}
      type="submit"
      className="w-20 md:w-32"
    >
      {sending ? (
        <>
          <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
          <span className="hidden md:inline">追加中...</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          追加
        </>
      )}
    </Button>
  )
}
