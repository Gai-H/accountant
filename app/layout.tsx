import type { Metadata } from "next"
import { Noto_Sans_JP as FontSans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import { cn } from "@/lib/utils"
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
        <Header />
        <main className="p-5 lg:mx-auto lg:w-3/5 lg:p-10">{children}</main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

// export const revalidate = 10
export const revalidate = 0
