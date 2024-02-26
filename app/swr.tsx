"use client"

import { SWRConfig } from "swr"
import { signOut } from "next-auth/react"
import { Response } from "@/types/api"

type Props = {
  children: React.ReactNode
}

function SWR({ children }: Props) {
  const checkUser = async (): Promise<boolean> => {
    const res = await fetch("/api/users/me")
    if (res.status !== 200) return false
    const json = await res.json()
    return json.data === true
  }

  return (
    <SWRConfig
      value={{
        fetcher: async (resource, init) => {
          if (!(await checkUser())) {
            signOut()
          }

          const res = await fetch(resource, init)
          const json: Response<any> = await res.json()
          if (json.message !== "ok") {
            throw new Error("API Error")
          }
          return json.data
        },
        refreshInterval: 10 * 1000, // 10 seconds
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWR
