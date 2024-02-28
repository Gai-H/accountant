import { Suspense } from "react"
import { Form, FormSkeleton } from "@/components/form"

function Create() {
  return (
    <Suspense fallback={<FormSkeleton edit={false} />}>
      <Form />
    </Suspense>
  )
}

export default Create
