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
import { Currencies, UsersGetResponse } from "@/types/firebase"
import { CurrencyFormField, DescriptionFormField, FromFormField, TitleFormField, ToFormField } from "./fields"
import { schema } from "./schema"

type UseFormData = {
  users: UsersGetResponse | undefined
  currencies: Currencies | undefined
  error: boolean
  isLoading: boolean
}

const useFormData = (): UseFormData => {
  const { data: users, error: usersError, isLoading: usersIsLoading } = useSWR<UsersGetResponse>("/api/users")
  const { data: currencies, error: currenciesError, isLoading: currenciesIsLoading } = useSWR<Currencies>("/api/currencies")

  return {
    users,
    currencies,
    error: usersError || currenciesError,
    isLoading: usersIsLoading || currenciesIsLoading,
  }
}

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
  const { users, currencies, error, isLoading } = useFormData()
  const { toast } = useToast()
  const router = useRouter()

  if (error) return <div className="text-center">Failed to Load</div>

  if (isLoading || users === undefined || currencies === undefined) return <div className="text-center">Loading...</div>

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
          <div className="md:w-[40em]">
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

export { Form }

type AddButtonProps = {
  sending: boolean
}

function AddButton({ sending }: AddButtonProps) {
  return (
    <Button
      disabled={sending}
      type="submit"
      className="md:w-32 w-20"
    >
      {sending ? (
        <>
          <Loader2 className="md:mr-2 h-4 w-4 animate-spin" />
          <span className="hidden md:inline">追加中...</span>
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          追加
        </>
      )}
    </Button>
  )
}
