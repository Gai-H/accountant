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

export type Transactions = {
  [id: string]: Transaction
}

export type User = {
  id: string
  global_name: string
  image_url: string
  lastLogin: number
}

export type UsersAllResponse = {
  [id: string]: {
    global_name: string
    image_url: string
  }
}
