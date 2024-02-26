"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Pop from "@/components/pop"

type AddTransactionButtonProps = {
  lock: boolean
}

function AddTransactionButton({ lock }: AddTransactionButtonProps) {
  return (
    <AddTransactionButtonFilter lock={lock}>
      <Button
        className={lock ? "opacity-50 cursor-not-allowed" : ""}
        asChild={true}
      >
        {lock ? (
          <span>
            <Plus className="w-4 h-4 mr-2" />
            記録を追加
          </span>
        ) : (
          <Link href="/create">
            <Plus className="w-4 h-4 mr-2" />
            記録を追加
          </Link>
        )}
      </Button>
    </AddTransactionButtonFilter>
  )
}

export { AddTransactionButton }

type AddTransactionButtonFilterProps = {
  lock: boolean
  children: React.ReactNode
}

function AddTransactionButtonFilter({ lock, children }: AddTransactionButtonFilterProps) {
  return (
    <Pop
      trigger={children}
      content={<div>この操作はロックされています</div>}
      disabled={!lock}
    />
  )
}
