"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import { ButtonLocker } from "@/components/button-locker"
import { remove } from "./actions"

type RemoveButtonProps = {
  transactionId: string
  lock: boolean
}

function RemoveButton({ transactionId, lock }: RemoveButtonProps) {
  const [sending, setSending] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setSending(true)
    router.prefetch("/")
    const res = await remove(transactionId)
    if (res.ok) {
      toast({
        title: "削除に成功しました",
      })
      router.replace("/")
    } else {
      toast({
        title: "削除に失敗しました",
        variant: "destructive",
      })
    }
    setSending(false)
  }

  return (
    <ButtonLocker lock={lock}>
      <AlertDialog>
        <AlertDialogTrigger
          asChild={true}
          disabled={sending}
        >
          <Button
            variant="destructive"
            className={`w-32 ${(lock || sending) && "opacity-50 pointer-events-none"}`}
            asChild={true}
            disabled={sending}
          >
            <span>
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              削除
            </span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>本当に削除しますか？</AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>いいえ</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>はい</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ButtonLocker>
  )
}

export { RemoveButton }
