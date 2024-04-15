import Pop from "./pop"

type ButtonLockerProps = {
  children: React.ReactNode
  lock: boolean
}

function ButtonLocker({ children, lock }: ButtonLockerProps) {
  return (
    <Pop
      trigger={children}
      content={<div>この操作はロックされています</div>}
      disabled={!lock}
    />
  )
}

export { ButtonLocker }
