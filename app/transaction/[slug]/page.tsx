"use client"

import { useState } from "react"
import useSWR from "swr"
import { notFound, useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import Amount from "@/components/amount"
import PageTitle from "@/components/page-title"
import Timestamp from "@/components/timestamp"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Transactions } from "@/types/firebase"
import { Response } from "@/types/api"

type PageProps = {
  params: {
    slug: string
  }
}

function Page({ params: { slug } }: PageProps) {
  const { data: res, error, isLoading } = useSWR<Transactions>("/api/transactions/all", { refreshInterval: 10000 })

  if (error) return <div className="text-center">Failed to load</div>

  if (isLoading || !res) return <div className="text-center">Loading...</div>

  const transaction = res[slug]
  if (!transaction) notFound()

  return (
    <>
      <PageTitle>
        記録<span className="ml-2">{transaction.title}</span>
      </PageTitle>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ItemTitle>日時</ItemTitle>
          <div>
            <Timestamp timestamp={transaction.timestamp} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ItemTitle>登録者</ItemTitle>
          <AvatarWithName id={transaction.addedBy} />
        </div>
        <div className="flex items-center gap-2">
          <ItemTitle>合計</ItemTitle>
          <div>
            <Amount
              amount={transaction.from.map((f) => f.amount).reduce((a, b) => a + b, 0)}
              currency={transaction.currency}
            />
          </div>
        </div>
        <div className="hidden w-fit grid-cols-[1fr_4rem_1fr] grid-rows-[2rem_1fr] md:grid">
          <div>
            <ItemTitle>貸した人</ItemTitle>
          </div>
          <div className="col-start-3">
            <ItemTitle>借りた人</ItemTitle>
          </div>
          <div className="col-start-2 row-start-2 row-end-3 flex items-center justify-center">→</div>
          <FromToTable
            data={transaction.from}
            currency={transaction.currency}
          />
          <FromToTable
            data={transaction.to}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2 md:hidden">
          <ItemTitle>貸した人</ItemTitle>
          <FromToTable
            data={transaction.from}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2 md:hidden">
          <ItemTitle>借りた人</ItemTitle>
          <FromToTable
            data={transaction.to}
            currency={transaction.currency}
          />
        </div>
        <div className="flex gap-2">
          <ItemTitle>説明</ItemTitle>
          {transaction.description ? <div className="text-lg">{transaction.description}</div> : <div className="text-lg italic">なし</div>}
        </div>
        <RemoveButton id={slug} />
      </div>
    </>
  )
}

export default Page

type ItemTitleProps = {
  children: React.ReactNode
}

function ItemTitle({ children }: ItemTitleProps) {
  return <h2 className="block w-[4.5rem] shrink-0 text-lg font-semibold">{children}</h2>
}

type AvatarWithNameProps = {
  id: string
}

function AvatarWithName({ id }: AvatarWithNameProps) {
  const { data: users } = useSWR("/api/users/all")

  return (
    <div className="flex items-center gap-2">
      <Avatar className="block h-6 w-6">
        {users && (
          <AvatarImage
            src={users[id].image_url}
            alt={users[id].global_name}
          />
        )}
        {users ? <AvatarFallback>{users[id].global_name.substring(0, 3)}</AvatarFallback> : <AvatarFallback>...</AvatarFallback>}
      </Avatar>
      <div>{users ? users[id].global_name : "..."}</div>
    </div>
  )
}

type FromToTableProps = {
  data: {
    id: string
    amount: number
  }[]
  currency: string
}

function FromToTable({ data, currency }: FromToTableProps) {
  return (
    <table className="h-fit border-separate">
      <tbody>
        {data.map((f) => (
          <tr key={f.id}>
            <td className="pb-2 pr-4">
              <AvatarWithName id={f.id} />
            </td>
            <td className="pb-2 pr-4">
              <Amount
                amount={f.amount}
                currency={currency}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type RemoveButtonProps = {
  id: string
}

function RemoveButton({ id }: RemoveButtonProps) {
  const [sending, setSending] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        disabled={sending}
      >
        <Button
          variant="destructive"
          className="mt-4 w-32"
          disabled={sending}
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              削除中...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              記録を削除
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>本当に削除しますか？</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>いいえ</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setSending(true)
              const res = await fetch("/api/transactions/remove", { method: "POST", body: JSON.stringify({ id }) })
              const json: Response<null, string> = await res.json()
              if (json.message === "ok") {
                setTimeout(() => {
                  toast({
                    title: "削除に成功しました",
                    duration: 4000,
                  })
                }, 100)
                router.back()
              } else {
                setTimeout(() => {
                  toast({
                    title: "削除に失敗しました",
                    description: json.error,
                    variant: "destructive",
                    duration: 4000,
                  })
                }, 100)
              }
              setSending(false)
            }}
          >
            はい
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
