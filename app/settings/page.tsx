"use client"

import { ReactNode } from "react"
import useSWR from "swr"
import PageTitle from "@/components/page-title"
import CurrencySettingCard from "@/components/settings/currency/currencySettingCard"
import CurrencySettingCardSkeleton from "@/components/settings/currency/currencySettingCardSkeleton"
import LockSettingCard from "@/components/settings/lock/lockSettingCard"
import LockSettingCardSkeleton from "@/components/settings/lock/lockSettingCardSkeleton"
import { Currencies } from "@/types/firebase"

function Settings() {
  return (
    <>
      <PageTitle>プロジェクト設定</PageTitle>
      <div className="flex flex-col gap-3">
        <LockSettingSection />
        <CurrencySettingSection />
      </div>
    </>
  )
}

export default Settings

type SectionTitleProps = {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-2 text-xl font-semibold text-inherit">{children}</h2>
}

function CurrencySettingSection() {
  const { data: currencies, error, isLoading } = useSWR<Currencies>("/api/currencies/all")

  if (error) {
    return (
      <section>
        <SectionTitle>通貨設定</SectionTitle>
        <p>Failed to load currencies</p>
      </section>
    )
  }

  const propCurrencies = Object.entries(currencies ?? {}).map(([id, currency]) => ({
    id,
    ...currency,
  }))

  return (
    <section>
      <SectionTitle>通貨設定</SectionTitle>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CurrencySettingCardSkeleton key={i} />)
          : propCurrencies.map((pc, i) => (
              <CurrencySettingCard
                currency={pc}
                key={i}
              />
            ))}
      </div>
    </section>
  )
}

function LockSettingSection() {
  const { data: lock, error, isLoading } = useSWR<boolean>("/api/lock")

  if (error) {
    return (
      <section>
        <SectionTitle>ロック設定</SectionTitle>
        <p>Failed to load lock</p>
      </section>
    )
  }

  return (
    <section>
      <SectionTitle>ロック設定</SectionTitle>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">{isLoading ? <LockSettingCardSkeleton /> : <LockSettingCard lock={lock as boolean} />}</div>
    </section>
  )
}
