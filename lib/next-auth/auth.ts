import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions, User } from "next-auth"
import { getServerSession } from "next-auth"
import db from "@/lib/firebase"
import { getNewUserLock } from "@/lib/firebase/new-user-lock"
import { provider as discordProvider } from "./providers/discord"
import { provider as lineProvider } from "./providers/line"

export const config = {
  providers: [discordProvider, lineProvider],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account == null || account.access_token == null || user === undefined) return false

      const isNewUser = await checkIfNewUser(user.id)
      const newUserLock = await getNewUserLock()

      if (isNewUser && (newUserLock === null || newUserLock)) {
        return false
      }

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
} satisfies NextAuthOptions

const checkIfNewUser = async (id: string): Promise<boolean> => {
  const ref = db.ref("users")
  const snapshot = await ref.child(id).get()
  return !snapshot.exists()
}

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

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, config)
}
