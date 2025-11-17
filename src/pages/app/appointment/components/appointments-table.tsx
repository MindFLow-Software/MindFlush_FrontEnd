"use client"

import { useQuery } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AppointmentsTableRow } from "./appointments-table-row"
import { getAppointments, type GetAppointmentsResponse } from "@/api/get-appointment"
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentsTable() {
    
    const pageIndex = 0
    const perPage = 10
    
    // 1. Query para buscar os dados
    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse, Error, GetAppointmentsResponse, (number)[]>({
        queryKey: [ pageIndex],
        queryFn: () => getAppointments({
            pageIndex: pageIndex,
            perPage: perPage,
        }),
        staleTime: 1000 * 60,
    })

    // 3. Destruturação segura
    const appointments = result?.appointments ?? []

    if (isLoading)
        return (
            <div className="rounded-lg border shadow-sm p-4">
                {Array.from({ length: perPage }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full mb-1" />
                ))}
            </div>
        )

    if (isError)
        return (
            <p className="text-center text-red-500">
                Erro ao carregar agendamentos.
            </p>
        )

    if (appointments.length === 0)
        return (
            <p className="text-center text-muted-foreground">
                Nenhum agendamento encontrado.
            </p>
        )

    return (
        <div className="rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Diagnóstico</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Opções</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {appointments.map((appointment) => (
                        <AppointmentsTableRow
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}