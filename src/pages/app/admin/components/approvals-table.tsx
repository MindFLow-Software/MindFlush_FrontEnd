import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCheck } from "lucide-react"
import { ApprovalsTableRow } from "./approvals-table-row"
import type { PendingPsychologist } from "@/api/approvals"

interface ApprovalsTableProps {
    psychologists: PendingPsychologist[]
    isLoading: boolean
}

export function ApprovalsTable({ psychologists, isLoading }: ApprovalsTableProps) {
    return (
        <div className="rounded-md border bg-background shadow-sm">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>CRP</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Idade / Nasc.</TableHead>
                        <TableHead>Tempo de Espera</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-center w-[220px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={7} className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-[250px]" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : psychologists.length > 0 ? (
                        psychologists.map((p) => (
                            <ApprovalsTableRow key={p.id} psychologist={p} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-20">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <UserCheck className="h-10 w-10 opacity-20" />
                                    <p className="font-medium">Nenhum psicólogo aguardando aprovação.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}