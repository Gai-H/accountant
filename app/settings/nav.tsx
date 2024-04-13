"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Page = {
  pathname: string
  title: string
}

const PAGES: Page[] = [
  {
    pathname: "/settings/currencies",
    title: "通貨",
  },
  {
    pathname: "/settings/users",
    title: "ユーザ",
  },
  {
    pathname: "/settings/locks",
    title: "ロック",
  },
]

function Nav() {
  const pathname = usePathname()

  return (
    <nav className="w-full flex flex-col gap-2">
      {PAGES.map((page) => (
        <Link
          key={page.pathname}
          className={cn(
            buttonVariants({ variant: pathname === page.pathname ? "default" : "secondary" }),
            pathname === page.pathname && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            "justify-start",
          )}
          href={page.pathname}
        >
          {page.title}
        </Link>
      ))}
    </nav>
  )
}

export { Nav }
