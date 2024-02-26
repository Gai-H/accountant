import { Transaction } from "@/types/firebase"

const getLendAmount = (transaction: Transaction, userId: string): number => {
  return transaction.from
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
}

const getBorrowedAmount = (transaction: Transaction, userId: string): number => {
  return transaction.to
    .filter((f) => f.id === userId)
    .map((f) => f.amount)
    .reduce((a, b) => a + b, 0)
}

export { getLendAmount, getBorrowedAmount }
