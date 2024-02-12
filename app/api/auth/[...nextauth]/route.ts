import NextAuth, { NextAuthOptions, User } from "next-auth"
import db from "@/app/api/firebase"
import { provider as discordProvider } from "./providers/discord"
import { provider as lineProvider } from "./providers/line"

export const authOptions: NextAuthOptions = {
  providers: [discordProvider, lineProvider],
  callbacks: {
    jwt: async ({ token, profile }) => {
      if (profile) {
        token.id = profile.id
      }
      return token
    },
    session: async ({ session, user }) => {
      session.user = user
      return session
    },
    async signIn({ user, account }) {
      if (account == null || account.access_token == null || user === undefined) return false

      return await insertUser(user)
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
      ...user,
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
