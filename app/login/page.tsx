import Image from "next/image"
import PageTitle from "@/components/page-title"
import { auth } from "@/lib/next-auth/auth"
import { DiscordDefaultButtonImage, DiscordHoverButtonImage, LineDefaultButtonImage, LineHoverButtonImage, LoginButton, LogoutButton } from "./button"

async function Login() {
  const session = await auth()

  if (session) {
    return (
      <>
        <PageTitle>ログイン済み</PageTitle>
        <p>
          {session.user.provider} ID <span className="font-semibold">{session.user.providerName}</span>
        </p>
        <LogoutButton />
      </>
    )
  } else {
    return (
      <div className="flex items-center flex-col gap-4">
        <LoginButton providerName="discord">
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
        </LoginButton>
        <LoginButton providerName="line">
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
        </LoginButton>
      </div>
    )
  }
}

export default Login
