"use client"

import { useRouter } from "next/navigation"
import useSWR from "swr"

function DataRevalidator() {
  const router = useRouter()

  useSWR("DataRevalidator", () => {
    router.refresh()
  })

  return null
}

export { DataRevalidator }
