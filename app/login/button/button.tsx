"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

type LoginButtonProps = {
  providerName: string
  children: React.ReactNode
}

function LoginButton({ providerName, children }: LoginButtonProps) {
  return (
    <button
      onClick={() => signIn(providerName, { callbackUrl: "/" })}
      className="block w-[250px] h-[40px] overflow-hidden relative"
    >
      {children}
    </button>
  )
}

function LogoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="mt-5"
    >
      ログアウト
    </Button>
  )
}

export { LoginButton, LogoutButton }
