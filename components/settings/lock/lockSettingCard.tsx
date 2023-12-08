import { useState } from "react"
import { mutate } from "swr"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import lockSettingSchema from "@/app/settings/lockSettingSchema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

type LockSettingCardProps = {
  lock: boolean
}

function LockSettingCard({ lock }: LockSettingCardProps) {
  const [sending, setSending] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof lockSettingSchema>>({
    resolver: zodResolver(lockSettingSchema),
    values: {
      lock,
    },
  })

  const onSubmit = async (values: z.infer<typeof lockSettingSchema>) => {
    setSending(true)
    const res = await fetch("/api/lock", { method: "PUT", body: JSON.stringify(values) })
    const json = await res.json()
    if (json.message === "ok") {
      toast({
        title: "ロック設定を更新しました",
        duration: 4000,
      })
      await mutate("/api/lock")
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={sending}>
              <FormField
                control={form.control}
                name="lock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>ロックする</FormLabel>
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
      </CardContent>
    </Card>
  )
}

export default LockSettingCard
