"use client"

import { useRouter } from "next/navigation"
import useSWR from "swr"

function DataRevalidator() {
  const router = useRouter()

  useSWR(
    "DataRevalidator",
    () => {
      router.refresh()
    },
    {
      refreshInterval: 10 * 1000, // 10 seconds
    },
  )

  return null
}

export { DataRevalidator }
