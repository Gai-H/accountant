"use client"

import { useRouter } from "next/navigation"
import { Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function CancelButton() {
  const router = useRouter()

  return (
    <Button
      className="w-32"
      variant="outline"
      onClick={() => {
        router.back()
      }}
      type="button"
    >
      <Undo2 className="w-4 h-4 mr-2" />
      戻る
    </Button>
  )
}

export { CancelButton }
