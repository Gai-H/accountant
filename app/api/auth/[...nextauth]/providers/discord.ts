import DiscordProvider from "next-auth/providers/discord"

const provider = DiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID as string,
  clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
  profile(profile) {
    if (profile.avatar === null) {
      const defaultAvatarNumber = parseInt(profile.discriminator) % 5
      profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
    } else {
      const format = profile.avatar.startsWith("a_") ? "gif" : "png"
      profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
    }
    return {
      provider: "Discord",
      id: `DISC-${profile.id}`,
      providerName: profile.global_name,
      displayName: profile.username,
      image: profile.image_url,
    }
  },
})

export { provider }
