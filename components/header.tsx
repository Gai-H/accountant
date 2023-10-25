import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Plus } from "lucide-react"

function Header() {
  return (
    <header className={"sticky top-0 w-full border-b px-6"}>
      <div className={"flex h-14 items-center lg:mx-auto lg:w-3/5"}>
        <Link
          href={"/"}
          className={"mr-4 text-lg font-semibold"}
        >
          Accountant
        </Link>
        <Button
          className="ml-auto mr-4"
          asChild
        >
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            記録を追加
          </Link>
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
        >
          <Link
            href={"https://github.com/Gai-H/accountant"}
            target={"_blank"}
          >
            <Github className={"h-4 w-4"} />
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default Header
