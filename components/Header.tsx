import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

function Header() {
  return (
    <header className={"sticky top-0 w-full border-b"}>
      <div className={"flex h-12 items-center justify-between lg:mx-auto lg:w-3/5"}>
        <Link
          href={"/"}
          className={"mr-4 text-lg font-semibold"}
        >
          Accountant
        </Link>
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
      </div>
    </header>
  )
}

export default Header
