import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

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
        <span className="hidden md:inline">
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
        </span>
        <Button
          variant={"link"}
          className="ml-auto mr-1"
        >
          <Link
            href={"/"}
            className="text-md border-b"
          >
            全員の記録
          </Link>
        </Button>
        <Button variant={"link"}>
          <Link
            href={"/user"}
            className="text-md border-b"
          >
            個人の記録
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default Header
