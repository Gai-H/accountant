import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Transaction } from "@/types/firebase"
import { RecordItem } from "./record-item"
import type { Record } from "./types"

type HistoryProps = {
  transaction: Transaction
}

async function History({ transaction }: HistoryProps) {
  const records: Record[] = [
    { userId: transaction.addedBy, timestamp: transaction.timestamp },
    ...Object.values(transaction.editHistory ?? {}).map((record) => ({ userId: record.editedBy, timestamp: record.timestamp })),
  ]

  return (
    <Card className="p-6 shadow-none min-h-[7rem] flex flex-col justify-center h-fit">
      <CardContent className="flex flex-col p-0">
        {records.map((record, idx) => (
          <div key={idx}>
            <RecordItem
              record={record}
              latest={idx === records.length - 1}
              edit={idx !== 0}
            />
            {idx !== records.length - 1 && <Separator className="w-[2px] h-4 ml-5 my-0.5" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { History }
