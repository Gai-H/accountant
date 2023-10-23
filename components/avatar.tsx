import { Avatar as ShadcnAvatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  name: string
}

function Avatar({ name }: Props) {
  return (
    <ShadcnAvatar
      className="inline-block h-9 w-9"
      title={name}
    >
      <AvatarFallback>{name.substring(0, 3)}</AvatarFallback>
    </ShadcnAvatar>
  )
}

export default Avatar
