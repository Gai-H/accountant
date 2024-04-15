"use client"

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { User } from "@/types/firebase"
import { removeUser } from "./actions"

type ItemProps = {
  user: User<"displayName" | "image">
  userId: string
}

function Item({ user, userId }: ItemProps) {
  return (
    <TableRow className="[&>td]:p-3">
      <TableCell className="flex gap-3 items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user.image}
            alt={user.displayName}
          />
          <AvatarFallback>{user.displayName}</AvatarFallback>
        </Avatar>
        {user.displayName}
      </TableCell>
      <TableCell>
        <RemoveUserDialog
          user={user}
          userId={userId}
        >
          <Button
            size="sm"
            variant="destructive"
          >
            削除
          </Button>
        </RemoveUserDialog>
      </TableCell>
    </TableRow>
  )
}

export { Item }

type RemoveUserDialogProps = ItemProps & {
  children: ReactNode
}

function RemoveUserDialog({ user, userId, children }: RemoveUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const handleRemoveUser = async () => {
    setSending(true)
    const res = await removeUser(userId)
    if (res.ok) {
      router.refresh()
      toast.success("ユーザの削除に成功しました")
      if (res.data.logout) {
        await signOut()
      }
    } else {
      toast.error("エラーが発生しました", {
        description: res.message,
      })
    }
    setSending(false)
  }

  return (
    <AlertDialog
      open={open || sending}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当にユーザ<span className="mx-1">{user.displayName}</span>を削除しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>この操作は実行すると、取り消せません。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={sending}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleRemoveUser}
            disabled={sending}
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
