import { Currency } from "@/lib/currency"

export type Transaction = {
  timestamp: number
  title: string
  currency: Currency
  from: {
    id: string
    amount: number
  }[]
  to: {
    id: string
    amount: number
  }[]
  description?: string
  addedBy: string
}

export type User = {
  id: string
  displayName: string
}
