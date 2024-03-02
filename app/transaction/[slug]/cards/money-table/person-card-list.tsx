import { PersonCard } from "./person-card"

type PersonCardListProps = {
  data: {
    id: string
    amount: number
  }[]
  currencyId: string
}

function PersonCardList({ data, currencyId }: PersonCardListProps) {
  return (
    <li className="flex flex-col gap-4 list-none">
      {data.map(({ id, amount }) => (
        <ul
          className="w-full"
          key={id}
        >
          <PersonCard
            userId={id}
            amount={amount}
            currencyId={currencyId}
          />
        </ul>
      ))}
    </li>
  )
}

export { PersonCardList }
