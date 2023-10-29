import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: { scope: "identify email guilds" },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
    jwt: async ({ token, account, profile }) => {
      if (account && account.access_token) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.id = profile.id
      }
      return token
    },
    async signIn({ account }) {
      if (account == null || account.access_token == null) return false
      return await isJoinGuild(account.access_token)
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

type Guild = {
  features: string[]
  icon: string
  id: string
  name: string
  owner: boolean
  permissions: number
  permissions_new: string
}

const isJoinGuild = async (accessToken: string): Promise<boolean> => {
  if (!process.env.DISCORD_GUILD_ID) return false

  const res: Response = await fetch("https://discordapp.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (res.ok) {
    const guilds: Guild[] = await res.json()
    return guilds.some((guild: Guild) => guild.id === (process.env.DISCORD_GUILD_ID as string))
  }
  return false
}
