"use client"

import { Users } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientsTableRow } from "./patients-table-row"
import type { Patient } from "@/api/get-patients"

interface PatientsTableProps {
    patients: Patient[]
    isLoading: boolean
    perPage?: number
}

export function PatientsTable({ patients, isLoading, perPage = 10 }: PatientsTableProps) {
    const columnCount = 9

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Paciente</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Documento</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Telefone</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Email</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Idade / Nasc.</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Gênero</TableHead>
                        <TableHead className="text-right pr-6 text-xs uppercase tracking-wider font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[120px]" />
                                            <Skeleton className="h-3 w-[80px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[100px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[100px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[140px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[80px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[60px]" />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRow
                                key={patient.id}
                                patient={patient}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="p-4 rounded-full bg-muted">
                                        <Users className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm font-medium">Nenhum paciente cadastrado.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}