"use client"

import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { Pagination } from "@/components/pagination"
import { AppointmentsTableFilters } from "./components/appointments-table-filters"
// Importando a TABELA COMPLETA do arquivo row (igual ao seu exemplo de Pacientes)
import { AppointmentsTable } from "./components/appointments-table-row"
import { getAppointments, type GetAppointmentsResponse } from "@/api/get-appointment"

export function AppointmentsList() {
    const [searchParams, setSearchParams] = useSearchParams()

    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const perPage = 10
    const status = searchParams.get('status') || undefined
    const note = searchParams.get('note') || undefined

    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse>({
        queryKey: ["appointments", pageIndex, perPage, status, note],
        queryFn: () => getAppointments({
            pageIndex,
            perPage,
            status,
        }),
        staleTime: 1000 * 60 * 5,
    })

    const appointments = result?.appointments ?? []
    const meta = result?.meta ?? { pageIndex: 0, perPage, totalCount: 0 }

    const handlePaginate = (newPageIndex: number) => {
        setSearchParams((state) => {
            state.set('pageIndex', String(newPageIndex))
            return state
        })
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-2">
                <p className="text-red-500 font-medium">Erro ao carregar agendamentos 😕</p>
                <p className="text-sm text-muted-foreground">Tente recarregar a página.</p>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Agendamentos" />

            <div className="flex flex-col gap-4 mt-6">
                <div className="space-y-5">
                    <AppointmentsTableFilters />

                    <AppointmentsTable
                        appointments={appointments}
                        isLoading={isLoading}
                        perPage={perPage}
                    />

                    {result && (
                        <Pagination
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={handlePaginate}
                        />
                    )}
                </div>
            </div>
        </>
    )
}