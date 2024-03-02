import { notFound } from "next/navigation"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrency } from "@/lib/firebase/currencies"
import { getUser } from "@/lib/firebase/users"

type PersonCardProps = {
  userId: string
  amount: number
  currencyId: string
}

async function PersonCard({ userId, amount, currencyId }: PersonCardProps) {
  const user = await getUser(userId)
  const currency = await getCurrency(currencyId)

  if (user === null || currency === null) {
    notFound()
  }

  const formattedAmount = amount.toLocaleString("ja-JP", { maximumFractionDigits: 2, minimumFractionDigits: 0 })

  return (
    <Card className="shadow-none py-2.5 px-4">
      <CardContent className="flex items-center p-0">
        <Avatar className="mr-2.5">
          <AvatarImage
            src={user.image}
            alt={user.displayName}
          />
        </Avatar>
        <p className="mr-auto">{user.displayName}</p>
        <p>
          <span className="mr-1.5">{currency.symbol}</span>
          {formattedAmount}
        </p>
      </CardContent>
    </Card>
  )
}

export { PersonCard }
