import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type PopProps = {
  trigger: React.ReactNode
  content: React.ReactNode
}

function Pop({ trigger, content }: PopProps) {
  const [open, setOpen] = useState<boolean>(false)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 text-sm">{content}</PopoverContent>
    </Popover>
  )
}

export default Pop
