"use client"

import { Response } from "@/types/api"
import { SWRConfig } from "swr"

type Props = {
  children: React.ReactNode
}

function SWR({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init)
          const json: Response<any> = await res.json()
          if (json.message !== "ok") {
            throw new Error("API Error")
          }
          return json.data
        },
        refreshInterval: 3 * 60 * 1000, // 3 minutes
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWR
