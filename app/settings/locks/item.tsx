"use client"

import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { updateSetting } from "@/lib/firebase/settings"
import { Settings } from "@/types/firebase"

type ItemProps = {
  checked: boolean
  title: string
  id: keyof Settings
}

function Item({ checked, title, id }: ItemProps) {
  const router = useRouter()

  const handleCheckedChange = async () => {
    await updateSetting(id, !checked)
    router.refresh()
  }

  return (
    <div className="flex w-full justify-between gap-3">
      <p>{title}</p>
      <Switch
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  )
}

export { Item }
