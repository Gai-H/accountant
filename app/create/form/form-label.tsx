import { ReactNode } from "react"
import { FormLabel as ShadcnFormLabel } from "@/components/ui/form"

type FormLabelProps = {
  children: ReactNode
}

function FormLabel({ children }: FormLabelProps) {
  return <ShadcnFormLabel className="text-lg font-semibold text-inherit">{children}</ShadcnFormLabel>
}

export default FormLabel
