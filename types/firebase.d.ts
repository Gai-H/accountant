import { Currency } from "@/lib/currency"

// includes ".", "#", "$", "/", "[", or "]" unique
type DiscordId = string

// non-unique
type DisplayName = string

export type Transaction = {
  timestamp: number
  title: string
  currency: Currency
  from: {
    discordId: DiscordId
    amount: number
  }[]
  to: DiscordId[]
  description?: string
}

export type User = {
  discordId: DiscordId
  displayName: DisplayName
}
