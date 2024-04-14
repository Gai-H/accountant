"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const TOAST_ID = "saving-alert"

type SavingAlertProps = {
  save: () => Promise<boolean>
  enabled?: boolean
}

function SavingAlert({ save, enabled }: SavingAlertProps) {
  const [showing, setShowing] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    showToast(true)
    const res = await save()
    if (res) {
      toast.dismiss(TOAST_ID)
      setShowing(false)

      toast.success("変更を保存しました")
      router.refresh()
    } else {
      showToast()
      toast.error("変更を保存できませんでした")
    }
  }

  const showToast = (saving?: boolean) => {
    const message = saving ? "変更を保存しています…" : "変更を保存しますか？"

    toast(message, {
      position: "top-center",
      duration: 10000000,
      action: (
        <Button
          onClick={handleClick}
          className="ml-auto"
          size="sm"
          disabled={saving}
        >
          保存
        </Button>
      ),
      dismissible: false,
      id: TOAST_ID,
    })
  }

  useEffect(() => {
    if (enabled) {
      showToast()
      setShowing(true)
    } else {
      if (!showing) return
      toast.dismiss(TOAST_ID)
      setShowing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, save])

  useEffect(() => {
    return () => {
      toast.dismiss(TOAST_ID)
      setShowing(false)
    }
  }, [])

  return null
}

export { SavingAlert }
