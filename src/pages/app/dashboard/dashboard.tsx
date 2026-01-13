"use client"

import { useState, useEffect } from 'react'
import { Helmet } from "react-helmet-async"
import { subDays } from 'date-fns'

import { useHeaderStore } from "@/hooks/use-header-store"
import { MonthPatientsAmountCard } from "./components/month-patients-amount-card"
import { PatientsAmountCard } from "./components/patients-amount-card"
import { PatientsByAgeChart } from "./components/patients-by-age-chart"
import { PatientsByGenderChart } from "./components/patients-by-gender-chart"
import { NewPatientsBarChart } from "./components/patients-amount-bar-chart"
import { SessionsBarChart } from './components/sessions-chart'
import { TotalWorkHoursCard } from './components/total-work-hours-card'

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

    const [dateRange, ] = useState<DateRange>(getInitialRange)
    const { from: startDate, to: endDate } = dateRange

    useEffect(() => {
        setTitle('Dashboard')
    }, [setTitle])


    return (
        <>
            <Helmet title="Dashboard" />

            <div className="flex flex-col gap-5 mt-6 px-2 pb-8">

                {/* Grid de Cards de Métricas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* <PatientsCountCard startDate={startDate} endDate={endDate} /> */}
                    <PatientsAmountCard />
                    <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
                    <TotalWorkHoursCard startDate={startDate} endDate={endDate} />
                </div>

                {/* Grid de Gráficos de Barra */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <NewPatientsBarChart endDate={endDate} />
                    <SessionsBarChart endDate={endDate} />
                </div>

                {/* Grid de Gráficos Demográficos */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <PatientsByAgeChart endDate={endDate} />
                    <PatientsByGenderChart endDate={endDate} />
                </div>
            </div>
        </>
    )
}