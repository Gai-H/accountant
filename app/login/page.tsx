"use client"

import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"
import DiscordDefaultButtonImage from "./buttons/Discord_Default.png"
import DiscordHoverButtonImage from "./buttons/Discord_Hover.png"
import LineDefaultButtonImage from "./buttons/Line_Default.png"
import LineHoverButtonImage from "./buttons/Line_Hover.png"

function Login() {
  const { data, status } = useSession()

  if (status === "loading") {
    return <div className="text-center">Loading...</div>
  } else if (status === "authenticated") {
    return (
      <>
        <PageTitle>ログイン済み</PageTitle>
        <p>
          {data.user.provider} ID <span className="font-semibold">{data.user.providerName}</span>
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
      <div className="flex items-center flex-col gap-4">
        <button
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          className="block w-[250px] h-[41px] overflow-hidden relative"
        >
          <Image
            src={DiscordDefaultButtonImage}
            alt="Discordでログイン"
            className="absolute top-0 left-0 hover:opacity-0"
          />
          <Image
            src={DiscordHoverButtonImage}
            alt="Discordでログイン"
            className="absolute top-0 left-0 opacity-0 hover:opacity-100"
          />
        </button>
        <button
          onClick={() => signIn("line", { callbackUrl: "/" })}
          className="block w-[250px] h-[41px] overflow-hidden relative"
        >
          <Image
            src={LineDefaultButtonImage}
            alt="LINEでログイン"
            className="absolute top-0 left-0 hover:opacity-0"
          />
          <Image
            src={LineHoverButtonImage}
            alt="LINEでログイン"
            className="absolute top-0 left-0 opacity-0 hover:opacity-100"
          />
        </button>
      </div>
    )
  }
}

export default Login
