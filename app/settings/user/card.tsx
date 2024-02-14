import { MouseEvent, useState } from "react"
import useSWR, { mutate } from "swr"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Response } from "@/types/api"
import { Transactions, UsersGetResponse } from "@/types/firebase"

function UserSettingCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <UserSettingList />
      </CardContent>
    </Card>
  )
}

export { UserSettingCard }

type UseData = {
  users: UsersGetResponse | undefined
  transactions: Transactions | undefined
  error: boolean
  isLoading: boolean
}

const useData = (): UseData => {
  const { data: users, error: usersError, isLoading: usersIsLoading } = useSWR<UsersGetResponse>("/api/users")
  const { data: transactions, error: transactionsError, isLoading: transactionsIsLoading } = useSWR<Transactions>("/api/transactions")

  return {
    users,
    transactions,
    error: usersError || transactionsError,
    isLoading: usersIsLoading || transactionsIsLoading,
  }
}

function UserSettingList() {
  const { users, transactions, error, isLoading } = useData()

  if (error) {
    return <p>Failed to load users list</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ユーザ名</TableHead>
          <TableHead className="w-10 text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="py-0">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="py-2.5">
                <Skeleton className="h-9 rounded-md px-3 w-12" />
              </TableCell>
            </TableRow>
          ))}
        {users &&
          transactions &&
          Object.keys(users).map((user) => (
            <TableRow key={user}>
              <TableCell className="py-0">{users[user].displayName}</TableCell>
              <TableCell className="flex items-center space-x-2 py-2.5">
                <UserRemoveButton
                  id={user}
                  users={users}
                  transactions={transactions}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

type UserRemoveButtonProps = {
  id: string
  users: UsersGetResponse
  transactions: Transactions
}

function UserRemoveButton({ id, users, transactions }: UserRemoveButtonProps) {
  const [sending, setSending] = useState<boolean>(false)
  const { toast } = useToast()
  const displayName = users[id].displayName

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    const hasTransactions = Object.values(transactions).some((t) => {
      return t.from.some((f) => f.id === id) || t.to.some((t) => t.id === id)
    })

    if (hasTransactions) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: `ユーザ "${displayName}" が関係する記録が存在するため削除できません。該当の記録を削除してから再試行してください。`,
      })
      e.preventDefault()
      return
    }
  }

  const handleConfirm = async () => {
    setSending(true)
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
    const json: Response<null, string> = await res.json()
    if (json.message === "ok") {
      setTimeout(() => {
        toast({
          title: "削除に成功しました",
          duration: 4000,
        })
      }, 100)
      await mutate("/api/users")
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
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild={true}
        disabled={sending}
      >
        <Button
          variant="default"
          size="sm"
          onClick={handleButtonClick}
          disabled={sending}
        >
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>ユーザ &quot;{displayName}&quot; を本当に削除しますか？</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>いいえ</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>はい</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
