import { Suspense } from "react"
import { Form, FormSkeleton } from "@/components/form"

function Create() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <Form />
    </Suspense>
  )
}

export default Create
