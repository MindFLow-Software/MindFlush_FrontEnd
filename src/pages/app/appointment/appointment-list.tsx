"use client"

import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Importe a linha da tabela individual e os filtros
import { AppointmentsTableRow } from "./components/appointments-table-row"
import { AppointmentsTableFilters } from "./components/appointments-table-filters"

import { getAppointments, type GetAppointmentsResponse } from "@/api/get-appointment"

export function AppointmentsList() {
    const [searchParams] = useSearchParams()
    // 1. Gerenciamento de Estado da URL (Paginação baseada em 1 na URL, 0 na API)
    const pageIndex = z.coerce
        .number()
        .int()
        .min(1)
        .catch(1)
        .transform((page) => page - 1)
        .parse(searchParams.get("pageIndex") ?? "1")

    const status = searchParams.get("status")
    const orderByParam = searchParams.get("orderBy")
    const perPage = Number(searchParams.get("perPage") ?? 10)

    const orderBy = (orderByParam === 'asc' || orderByParam === 'desc') ? orderByParam : 'desc'

    // 2. Query de Agendamentos
    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse, Error>({
        queryKey: ["appointments", pageIndex, status, orderBy],
        queryFn: () =>
            getAppointments({
                pageIndex,
                perPage,
                status: status === "all" ? null : status,
                orderBy,
            }),
        staleTime: 1000 * 60 * 5,
    })

    const appointments = result?.appointments ?? []

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

            <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2.5">
                    <AppointmentsTableFilters />

                    {isLoading ? (
                        <div className="rounded-md border p-4 space-y-2">
                            {/* Skeleton Loading - Simula as linhas da tabela */}
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16"></TableHead>
                                        <TableHead className="w-[180px]">Paciente</TableHead>
                                        <TableHead className="w-[140px]">Diagnóstico</TableHead>
                                        <TableHead className="w-[140px]">Notas</TableHead>
                                        <TableHead className="w-[180px]">Data/Hora</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {appointments.length > 0 ? (
                                        appointments.map((appointment) => (
                                            // Renderiza a linha diretamente aqui, passando o objeto appointment
                                            <AppointmentsTableRow
                                                key={appointment.id}
                                                appointment={appointment}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableHead
                                                colSpan={7}
                                                className="text-center text-muted-foreground py-8"
                                            >
                                                Nenhum agendamento encontrado.
                                            </TableHead>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}