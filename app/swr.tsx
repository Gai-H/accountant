"use client"

import { SWRConfig } from "swr"

type Props = {
  children: React.ReactNode
}

function SWR({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        refreshInterval: 3 * 60 * 1000, // 3 minutes
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWR
