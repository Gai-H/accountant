"use client"

import PageTitle from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"

function Login() {
  const { data, status } = useSession()

  if (status === "loading") {
    return <PageTitle>Loading...</PageTitle>
  } else if (status === "authenticated") {
    return (
      <>
        <PageTitle>ログイン済み</PageTitle>
        <p>Discord ID: {data.user.name}</p>
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
    return <Button onClick={() => signIn()}>Discordでログイン</Button>
  }
}

export default Login
