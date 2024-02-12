import NextAuth, { NextAuthOptions, User } from "next-auth"
import db from "@/app/api/firebase"
import { provider as discordProvider } from "./providers/discord"
import { provider as lineProvider } from "./providers/line"

export const authOptions: NextAuthOptions = {
  providers: [discordProvider, lineProvider],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account == null || account.access_token == null || user === undefined) return false

      return await insertUser(user)
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user = token.user
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

const insertUser = async (user: User): Promise<boolean> => {
  const ref = db.ref("users")
  await ref.child(user.id).set(
    {
      provider: user.provider,
      providerName: user.providerName,
      displayName: user.displayName,
      image: user.image,
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
