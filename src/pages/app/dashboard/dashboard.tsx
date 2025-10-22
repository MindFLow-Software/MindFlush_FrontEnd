"use client"

import { Helmet } from "react-helmet-async"
import { MonthRevenueCard } from "./month-revenue-card"
import { MonthPatientsAmountCard } from "./month-patients-amount-card"
import { PatientsAmountCard } from "./patients-amount-card"
import { DaySessionsAmountCard } from "./day-sessions-amount-card"
import { SessionsChart } from "./sessions-chart"
import { PatientsByAgeChart } from "./patients-by-age-chart"
import { PatientsByGenderChart } from "./patients-by-gender-chart"
import { DateRangePicker } from "./date-range-picker"
import { NewPatientsChart } from "./new-patients-chart"

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <DateRangePicker onChange={(range) => console.log("Período:", range)} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MonthRevenueCard />
          <PatientsAmountCard />
          <MonthPatientsAmountCard />
          <DaySessionsAmountCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <SessionsChart />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <PatientsByAgeChart />
        <PatientsByGenderChart />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-2">
        <NewPatientsChart />
      </div>
    </>
  )
}
