import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import CurrencySettingFormSkeleton from "./currencySettingFormSkeleton"

function CurrencySettingCardSkeleton() {
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

export default CurrencySettingCardSkeleton
