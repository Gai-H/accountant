import Link from "next/link"
import { Github, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function Header() {
  return (
    <header className={"z-50 w-full border-b bg-inherit px-6"}>
      <div className={"flex h-14 items-center lg:mx-auto lg:w-3/5"}>
        <Link
          href={"/"}
          className={"mr-4 text-xl font-semibold"}
        >
          Accountant
        </Link>
        <span>
          <Link
            href={"https://github.com/Gai-H/accountant"}
            target={"_blank"}
          >
            <Button
              variant={"outline"}
              size={"icon"}
            >
              <Github className={"h-4 w-4"} />
            </Button>
          </Link>
        </span>
        <Link
          href="/login"
          className="ml-auto"
        >
          <Button
            variant="outline"
            size="icon"
          >
            <User2 className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}

export default Header
