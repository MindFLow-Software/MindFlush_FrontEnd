"use client"

import { useState, useEffect, useCallback } from 'react'
import { Helmet } from "react-helmet-async"
import { subDays } from 'date-fns'

import { useHeaderStore } from "@/hooks/use-header-store"
import { PatientsCountCard } from "./components/patients-count-card"
import { MonthPatientsAmountCard } from "./components/month-patients-amount-card"
import { PatientsAmountCard } from "./components/patients-amount-card"
import { SessionsChart } from "./components/sessions-chart"
import { PatientsByAgeChart } from "./components/patients-by-age-chart"
import { PatientsByGenderChart } from "./components/patients-by-gender-chart"
import { NewPatientsBarChart } from "./components/patients-amount-bar-chart"
import { DateRangePicker } from "./components/date-range-picker"

interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

const getInitialRange = (): DateRange => {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)
    return { from: thirtyDaysAgo, to: today }
}

export function Dashboard() {
    const { setTitle } = useHeaderStore()

    const [dateRange, setDateRange] = useState<DateRange>(getInitialRange)
    const { from: startDate, to: endDate } = dateRange

    useEffect(() => {
        setTitle('Dashboard')
    }, [setTitle])

    const handleRangeChange = useCallback((range: { from: Date; to: Date }) => {
        setDateRange(range)
    }, [])

    return (
        <>
            <Helmet title="Dashboard" />

            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">

                <div className="flex justify-end">
                    <DateRangePicker
                        onChange={handleRangeChange}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <PatientsCountCard startDate={startDate} endDate={endDate} />
                    <PatientsAmountCard />
                    <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2">
                <NewPatientsBarChart startDate={startDate} endDate={endDate} />
                <SessionsChart startDate={startDate} endDate={endDate} />
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 mb-6">
                <PatientsByAgeChart startDate={startDate} endDate={endDate} />
                <PatientsByGenderChart startDate={startDate} endDate={endDate} />
            </div>
        </>
    )
}