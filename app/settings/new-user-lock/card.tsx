"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { schema } from "./schema"

function NewUserLockSettingCard() {
  const { data: newUserLock, error, isLoading } = useSWR<boolean>("/api/new-user-lock")
  return (
    <Card className="h-fit">
      <CardContent className="pt-6">
        {error && <p>Failed to load new user lock</p>}
        {isLoading && <NewUserLockSettingFormSkeleton />}
        {newUserLock !== undefined && <NewUserLockSettingForm newUserLock={newUserLock} />}
      </CardContent>
    </Card>
  )
}

export { NewUserLockSettingCard }

type NewUserLockSettingFormProps = {
  newUserLock: boolean
}

function NewUserLockSettingForm({ newUserLock }: NewUserLockSettingFormProps) {
  const [sending, setSending] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      "new-user-lock": newUserLock,
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSending(true)
    const res = await fetch("/api/new-user-lock", { method: "PUT", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: "ユーザ設定を更新しました",
        duration: 4000,
      })
      await mutate("/api/new-user-lock")
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={sending}>
          <FormField
            control={form.control}
            name="new-user-lock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>新規ユーザの参加を不可能にする</FormLabel>
                </div>
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

function NewUserLockSettingFormSkeleton() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      "new-user-lock": false,
    },
  })

  return (
    <Form {...form}>
      <form>
        <fieldset>
          <FormField
            control={form.control}
            name="new-user-lock"
            render={() => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Skeleton className="h-5 w-20" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-10 w-20 px-4 py-2" />
            <Skeleton className="h-10 w-16 px-4 py-2" />
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
