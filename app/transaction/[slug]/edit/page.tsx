import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Form, FormSkeleton } from "@/components/form"
import { getTransaction } from "@/lib/firebase/transactions"

async function Page({ params }: { params: { slug: string } }) {
  const transactionId = params.slug
  const target = await getTransaction(transactionId)

  if (target === null) {
    notFound()
  }

  return (
    <Suspense fallback={<FormSkeleton edit={true} />}>
      <Form
        transactionId={transactionId}
        defaultValues={target}
      />
    </Suspense>
  )
}

export default Page
