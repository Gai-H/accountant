import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrencies } from "@/lib/firebase/currencies"
import { getUsers } from "@/lib/firebase/users"
import { Users } from "@/types/firebase"
import { InteractiveForm } from "./interactive-form"
import { schema } from "./schema"

type FormProps = {
  defaultValues?: z.infer<typeof schema>
  transactionId?: string
}

async function Form({ defaultValues: specifiedDefaultValues, transactionId }: FormProps) {
  const users = await getUsers()
  const currencies = await getCurrencies()

  if (users === null || currencies === null) {
    notFound()
  }

  const filteredUsers: Users<"displayName" | "image"> = Object.entries(users).reduce(
    (acc, [id, user]) => {
      acc[id] = {
        displayName: user.displayName,
        image: user.image,
      }
      return acc
    },
    {} as Users<"displayName" | "image">,
  )

  const defaultValues: z.infer<typeof schema> = specifiedDefaultValues ?? {
    title: "",
    description: "",
    from: [{ id: "", amount: Number.MIN_SAFE_INTEGER }],
    to: [{ id: "", amount: Number.MIN_SAFE_INTEGER }],
    currency: "",
  }

  return (
    <InteractiveForm
      users={filteredUsers}
      currencies={currencies}
      defaultValues={defaultValues}
      transactionId={transactionId}
    />
  )
}

export { Form }
