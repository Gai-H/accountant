"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { schema } from "./schema"

function NewUserLockSettingCardSkeleton() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      "new-user-lock": false,
    },
  })

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={() => {}}>
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
      </CardContent>
    </Card>
  )
}

export { NewUserLockSettingCardSkeleton }
