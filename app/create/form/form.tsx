import { notFound } from "next/navigation"
import { getCurrencies } from "@/lib/firebase/currencies"
import { getUsers } from "@/lib/firebase/users"
import { Users } from "@/types/firebase"
import { InteractiveForm } from "./interactive-form"

async function Form() {
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

  return (
    <InteractiveForm
      users={filteredUsers}
      currencies={currencies}
    />
  )
}

export { Form }
