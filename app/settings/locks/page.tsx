import { notFound } from "next/navigation"
import { getSettings } from "@/lib/firebase/settings"
import { Item } from "./item"

async function Page() {
  const settings = await getSettings()
  if (settings === null) notFound()

  return (
    <div className="flex flex-col gap-5">
      <Item
        title="記録の追加と編集を制限する"
        checked={settings["newTransactionLock"]}
        id="newTransactionLock"
      />
      <Item
        title="新規ユーザの参加を制限する"
        checked={settings["newUserLock"]}
        id="newUserLock"
      />
    </div>
  )
}

export default Page
