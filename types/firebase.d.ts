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
  id: string
  globalName: string
  imageUrl: string
  lastLogin: number
}

export type UsersGetResponse = {
  [id: string]: {
    globalName: string
    imageUrl: string
  }
}

export type Currency = {
  oneInJPY: number
  symbol: string
}

export type Currencies = {
  [id: string]: Currency
}
