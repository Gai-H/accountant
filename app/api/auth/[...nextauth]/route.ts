import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord"
import db from "@/app/api/firebase"

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
    jwt: async ({ token, profile }) => {
      if (profile) {
        token.id = profile.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
    async signIn({ account, profile }) {
      if (account == null || account.access_token == null || profile === undefined) return false

      // check if user is in guild
      if (!(await isJoinGuild(account.access_token))) return false

      // add user to database
      return await insertUser(profile as DiscordProfile)
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

const insertUser = async (profile: DiscordProfile): Promise<boolean> => {
  const ref = db.ref("users")
  await ref.child(profile.id).set(
    {
      globalName: profile.global_name,
      imageUrl: profile.image_url,
      lastLogin: Date.now() / 1000,
    },
    (error) => {
      if (error) {
        console.error("Failed to insert user: " + error)
        return false
      }
    },
  )
  return true
}
