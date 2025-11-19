"use client"

import { Helmet } from "react-helmet-async"
import { PatientsCountCard } from "./components/patients-count-card"
import { MonthPatientsAmountCard } from "./components/month-patients-amount-card"
import { PatientsAmountCard } from "./components/patients-amount-card"
import { SessionsChart } from "./components/sessions-chart"
import { PatientsByAgeChart } from "./components/patients-by-age-chart"
import { PatientsByGenderChart } from "./components/patients-by-gender-chart"
import { DateRangePicker } from "./components/date-range-picker"
import { NewPatientsBarChart } from "./components/patients-amount-bar-chart"
import { useState } from 'react'
import { subDays } from 'date-fns'

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
    const [dateRange, setDateRange] = useState<DateRange>(getInitialRange)
    const { from: startDate, to: endDate } = dateRange

    const handleRangeChange = (range: DateRange) => {
        if (range.from && range.to) {
            setDateRange(range)
        }
    }

    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>

                <DateRangePicker
                    onChange={handleRangeChange}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <PatientsCountCard startDate={startDate} endDate={endDate} />
                    <PatientsAmountCard />
                    <MonthPatientsAmountCard />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2">
                <NewPatientsBarChart startDate={startDate} endDate={endDate} />
                <SessionsChart />
            </div>

            <div className="grid grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-2">
                <PatientsByAgeChart startDate={startDate} endDate={endDate} />
                <PatientsByGenderChart startDate={startDate} endDate={endDate} />
            </div>
        </>
    )
}