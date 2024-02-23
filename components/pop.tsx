"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type PopProps = {
  trigger: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

function Pop({ trigger, content, disabled }: PopProps) {
  const [open, setOpen] = useState<boolean>(false)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <Popover
      open={open && !disabled}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-fit w-fit"
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="p-2 text-sm w-fit">{content}</PopoverContent>
    </Popover>
  )
}

export default Pop
