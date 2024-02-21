import LineProvider from "next-auth/providers/line"

const provider = LineProvider({
  clientId: process.env.LINE_CLIENT_ID as string,
  clientSecret: process.env.LINE_CLIENT_SECRET as string,
  profile(profile) {
    return {
      provider: "LINE",
      id: `LINE-${profile.sub}`,
      providerName: profile.name,
      displayName: profile.name,
      image: profile.picture,
    }
  },
})

export { provider }
