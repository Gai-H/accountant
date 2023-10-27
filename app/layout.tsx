import type { Metadata } from "next"
import { Noto_Sans_JP as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import SessionProvider from "./session-provider"

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
          <Header />
          <main className="p-5 lg:mx-auto lg:w-3/5 lg:p-10">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
