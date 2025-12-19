// "use client"

// import { useState, useEffect, useCallback } from 'react'
// import { Helmet } from "react-helmet-async"
// import { subDays } from 'date-fns'

// import { useHeaderStore } from "@/hooks/use-header-store"
// import { TotalRevenueCard } from './components/total-revenue-card'
// import { CompletedTransactionsCard } from './components/completed-transactions-card'
// import { AvailableWithdrawalCard } from './components/available-withdrawal-card'


// interface DateRange {
//     from: Date | undefined
//     to: Date | undefined
// }

// const getInitialRange = (): DateRange => {
//     const today = new Date()
//     const thirtyDaysAgo = subDays(today, 30)
//     return { from: thirtyDaysAgo, to: today }
// }

// export function DashboardFinance() {
//     const { setTitle } = useHeaderStore()

//     const [dateRange, setDateRange] = useState<DateRange>(getInitialRange)
//     // const { from: startDate, to: endDate } = dateRange

//     useEffect(() => {
//         setTitle('Dashboard Financeiro')
//     }, [setTitle])

//     const handleRangeChange = useCallback((range: { from: Date; to: Date }) => {
//         setDateRange(range)
//     }, [])

//     return (
//         <>
//             <Helmet title="Dashboard Financeiro" />

//             <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">

//                 <div className="flex justify-end">
//                     {/* <DateRangePicker
//                         onChange={handleRangeChange}
//                     /> */}
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     <TotalRevenueCard totalRevenue={0} monthlyRevenue={0} />
//                     <CompletedTransactionsCard />
//                     <AvailableWithdrawalCard totalAvailable={0} pendingAmount={0} />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2">
//                 {/* <NewPatientsBarChart startDate={startDate} endDate={endDate} />
//                 <SessionsChart startDate={startDate} endDate={endDate} /> */}
//             </div>

//             <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 mb-6">
//                 {/* <PatientsByAgeChart startDate={startDate} endDate={endDate} />
//                 <PatientsByGenderChart startDate={startDate} endDate={endDate} /> */}
//             </div>
//         </>
//     )
// }