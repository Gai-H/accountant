"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

function Login() {
  const { data, status } = useSession()

  if (status === "loading") {
    return <div className="text-center">Loading...</div>
  } else if (status === "authenticated") {
    return (
      <>
        <PageTitle>ログイン済み</PageTitle>
        <p>
          Discord ID <span className="font-semibold">{data.user.name}</span>
        </p>
        <Button
          onClick={() => signOut()}
          className="mt-5"
        >
          ログアウト
        </Button>
      </>
    )
  } else {
    // status === "unauthenticated"
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          className="mt-10 block"
        >
          Discordでログイン
        </Button>
      </div>
    )
  }
}

export default Login
