"use client"

import { Helmet } from "react-helmet-async"
import { DiscountValueCard } from "./components/discount-value-card.tsx"
import { CompletedTransactionsCard } from "./components/completed-transactions-card.tsx"
import { DateRangePicker } from "./components/date-range-picker.tsx"
import { useState } from 'react'
import { subDays } from 'date-fns'
import { TotalBalanceCard } from "./components/total-balance-card.tsx"

interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

const getInitialRange = (): DateRange => {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)
    return { from: thirtyDaysAgo, to: today }
}

export function DashboardFinance() {
    const [] = useState<DateRange>(getInitialRange)

    const handleRangeChange = (range: DateRange) => {
        if (range.from && range.to) {
        }
    }

    return (
        <>
            <Helmet title="Pagamentos" />
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pagamentos</h1>

                <DateRangePicker
                    onChange={handleRangeChange}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TotalBalanceCard />
                    <CompletedTransactionsCard />
                    <DiscountValueCard />
                </div>
            </div>
        </>
    )
}