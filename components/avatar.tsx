import { Avatar as ShadcnAvatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  id: string
}

function Avatar({ id }: Props) {
  return (
    <ShadcnAvatar className="inline-block h-9 w-9">
      <AvatarFallback>{id.substring(0, 3)}</AvatarFallback>
    </ShadcnAvatar>
  )
}

export default Avatar
