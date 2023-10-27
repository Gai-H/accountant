"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

type Props = {
  children?: React.ReactNode
}

function SessionProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}

export default SessionProvider
