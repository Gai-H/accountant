import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Currency } from "@/types/firebase"
import { CurrencySettingForm } from "./currencySettingForm"

type CurrencySettingCardProps = {
  currency: Currency & {
    id: string
  }
}

function CurrencySettingCard(props: CurrencySettingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{props.currency.id}</CardTitle>
        <CardContent className="p-0">
          <CurrencySettingForm currency={props.currency} />
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export { CurrencySettingCard }
