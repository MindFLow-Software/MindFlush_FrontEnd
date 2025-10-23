"use client"

import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PatientsTableRow } from "./components/patients-table-row"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { Pagination } from "@/components/pagination"
import { getPatients } from "@/api/table-patients"
import { Skeleton } from "@/components/ui/skeleton"

export function PatientsList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["patients"],
        queryFn: getPatients,
    })

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Lista de Pacientes</h1>
                <div className="space-y-2.5">
                    <PatientsTableFilters />
                    <div className="rounded-md border p-4 space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Lista de Pacientes</h1>
                <p className="text-red-500">Erro ao carregar pacientes 😕</p>
            </div>
        )
    }

    const patients = data?.patients ?? []

    return (
        <>
            <Helmet title="Lista de Pacientes" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Lista de Pacientes</h1>

                <div className="space-y-2.5">
                    <PatientsTableFilters />

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]" />
                                    <TableHead className="w-[140px]">CPF</TableHead>
                                    <TableHead className="w-[160px]">Paciente</TableHead>
                                    <TableHead className="w-[140px]">Telefone</TableHead>
                                    <TableHead className="w-[160px]">Data de Nascimento</TableHead>
                                    <TableHead className="w-[140px]">Email</TableHead>
                                    <TableHead className="w-[140px]">Gênero</TableHead>
                                    <TableHead className="w-[140px]">Status</TableHead>
                                    <TableHead className="w-[140px]">Opções</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {patients.length > 0 ? (
                                    patients.map((patient: any) => (
                                        <PatientsTableRow key={patient.id} patient={patient} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableHead
                                            colSpan={9}
                                            className="text-center text-muted-foreground py-6"
                                        >
                                            Nenhum paciente encontrado.
                                        </TableHead>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination
                        pageIndex={0}
                        totalCount={patients.length}
                        perPage={10}
                    />
                </div>
            </div>
        </>
    )
}
