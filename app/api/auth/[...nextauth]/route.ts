import NextAuth from "next-auth"
import { config } from "@/lib/next-auth/auth"

const handler = NextAuth(config)

export { handler as GET, handler as POST }
