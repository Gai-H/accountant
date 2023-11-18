import type { Metadata } from "next"
import SWR from "./swr"
import { Analytics } from "@vercel/analytics/react"
import SessionProvider from "./session-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { Noto_Sans_JP as FontSans } from "next/font/google"
import "./globals.css"

const fontSans = FontSans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Accountant",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionProvider>
          <SWR>
            <Header />
            <main className="p-5 lg:mx-auto lg:w-3/5 lg:p-10">{children}</main>
            <Toaster />
            <Analytics />
          </SWR>
        </SessionProvider>
      </body>
    </html>
  )
}
