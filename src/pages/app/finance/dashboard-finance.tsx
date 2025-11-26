// "use client"

// import { useEffect, useState } from 'react'
// import { Helmet } from "react-helmet-async"
// import { subDays } from 'date-fns'


// import { DiscountValueCard } from "./components/discount-value-card.tsx"
// import { CompletedTransactionsCard } from "./components/completed-transactions-card.tsx"
// import { DateRangePicker } from "./components/date-range-picker.tsx"
// import { TotalBalanceCard } from "./components/total-balance-card.tsx"
// import { useHeaderStore } from '@/hooks/use-header-store.ts'

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

//     useEffect(() => {
//         setTitle('Pagamentos')
//     }, [setTitle])

//     // State declaration is correct
//     const [dateRange, setDateRange] = useState<DateRange>(getInitialRange)

//     const handleRangeChange = (range: DateRange) => {
//         if (range.from && range.to) {
//             setDateRange(range)
//         }
//     }

//     return (
//         <>
//             <Helmet title="Pagamentos" />
//             <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">

//                 {/* 1. PASS THE CURRENT DATE RANGE TO THE PICKER */}
//                 <DateRangePicker
//                     onChange={handleRangeChange}
//                     // Added props to pass the current range state
//                     initialRange={dateRange} 
//                 />

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {/* 2. PASS THE DATE RANGE TO THE CARD COMPONENTS */}
//                     <TotalBalanceCard dateRange={dateRange} />
//                     <CompletedTransactionsCard dateRange={dateRange} />
//                     <DiscountValueCard dateRange={dateRange} />
//                 </div>
//             </div>
//         </>
//     )
// }