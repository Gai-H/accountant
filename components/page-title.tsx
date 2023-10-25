type Props = {
  children: React.ReactNode
}

function PageTitle({ children }: Props) {
  return <h1 className="mb-4 text-2xl font-bold">{children}</h1>
}

export default PageTitle
