import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import CurrencySettingForm from "./currencySettingForm"
import CurrencySettingFormSkeleton from "./currencySettingFormSkeleton"
import { Currency } from "@/types/firebase"

type CurrencySettingCardProps =
  | {
      currency: Currency & {
        id: string
      }
    }
  | {
      loading: true
    }

function CurrencySettingCard(props: CurrencySettingCardProps) {
  if ("loading" in props) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Skeleton className="h-6 w-12" />
          </CardTitle>
          <CardContent className="p-0">
            <CurrencySettingFormSkeleton />
          </CardContent>
        </CardHeader>
      </Card>
    )
  }

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

export default CurrencySettingCard
