import { Helmet } from 'react-helmet-async'
import { MonthRevenueCard } from './month-revenue-card'
import { MonthPatientsAmountCard } from './month-patients-amount-card'
import { MonthCancellationsAmountCard } from './month-cancellations-amount-card'
import { DaySessionsAmountCard } from './day-sessions-amount-card'
import { SessionsChart } from './sessions-chart'
import { PatientsByAgeChart } from './patients-by-age-chart'
import { PatientsByGenderChart } from './patients-by-gender-chart'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenueCard />
          <MonthPatientsAmountCard />
          <MonthCancellationsAmountCard />
          <DaySessionsAmountCard />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <SessionsChart />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <PatientsByAgeChart />
        <PatientsByGenderChart/>

      </div>
    </>
  )
}