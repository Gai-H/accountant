export type Transaction = {
  timestamp: number
  title: string
  currency: string
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
  provider: string
  id: string // TODO: 消す
  providerName: string
  displayName: string
  image: string
  lastLogin: number
}

export type Users = {
  [id: string]: User
}

// TODO: 消す
export type UsersGetResponse = {
  [id: string]: {
    displayName: string
    image: string
  }
}

export type Currency = {
  oneInJPY: number
  symbol: string
}

export type Currencies = {
  [id: string]: Currency
}
