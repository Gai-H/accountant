"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ButtonLocker } from "@/components/button-locker"
import { cn } from "@/lib/utils"

type AddTransactionButtonProps = {
  lock: boolean
}

function AddTransactionButton({ lock }: AddTransactionButtonProps) {
  return (
    <ButtonLocker lock={lock}>
      <Link
        href="/create"
        className={cn(buttonVariants({ variant: "default" }), lock && "pointer-events-none opacity-50")}
      >
        <Plus className="w-4 h-4 mr-2" />
        記録を追加
      </Link>
    </ButtonLocker>
  )
}

export { AddTransactionButton }
