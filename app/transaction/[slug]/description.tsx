import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DescriptionProps = {
  description: string | undefined
}

function Description({ description }: DescriptionProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">説明</CardTitle>
      </CardHeader>
      <CardContent>
        {description ? <p className="whitespace-pre-line">{description}</p> : <p className="text-muted-foreground">説明はありません</p>}
      </CardContent>
    </Card>
  )
}

export { Description }
