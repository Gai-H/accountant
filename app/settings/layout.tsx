import { ReactNode } from "react"
import PageTitle from "@/components/page-title"
import { Nav } from "./nav"

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageTitle>設定</PageTitle>
      <div className="flex gap-16 w-full mt-6">
        <div className="md:w-48 md:block hidden shrink-0">
          <Nav />
        </div>
        <div className="grow">{children}</div>
      </div>
    </>
  )
}

export default Layout
