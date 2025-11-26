"use client"

import { useState } from "react"
import { Search, Trash2, UserPen, Mars, Venus, Users, CircleUser, CalendarDays, Phone, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { PatientsDetails } from "./patients-details"
import { EditPatient } from "./edit-patient-dialog"
import { DeletePatientDialog } from "./delete-patient-dialog"
import { deletePatients } from "@/api/delete-patients"
import type { UpdatePatientData } from "@/api/upadate-patient"
import type { Patient } from "@/api/get-patients"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { formatAGE } from "@/utils/formatAGE"

const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

interface PatientsTableProps {
    patients: Patient[]
    isLoading: boolean
    perPage?: number
}

export function PatientsTable({ patients, isLoading, perPage = 10 }: PatientsTableProps) {
    return (
        <div className="rounded-md border bg-background shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Idade / Nasc.</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Gênero</TableHead>
                        <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={i}>
                                <TableHead colSpan={8}>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </TableHead>
                            </TableRow>
                        ))
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRowItem key={patient.id} patient={patient} />
                        ))
                    ) : (
                        <TableRow>
                            <TableHead colSpan={8} className="text-center text-muted-foreground py-10">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Users className="h-8 w-8 text-muted-foreground/50" />
                                    <p>Nenhum paciente encontrado.</p>
                                </div>
                            </TableHead>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function PatientsTableRowItem({ patient }: { patient: Patient }) {
    const p = patient as Patient & {
        role?: "PATIENT" | "ADMIN" | "DOCTOR";
        profileImageUrl?: string
    }

    const { id, cpf, email, firstName, lastName, dateOfBirth, phoneNumber, gender, status, role, profileImageUrl } = p

    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const queryClient = useQueryClient()

    const { mutateAsync: deletePatientFn, isPending: isDeleting } = useMutation({
        mutationFn: deletePatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
        }
    })

    const patientDataForEdit: UpdatePatientData = {
        id,
        firstName,
        lastName,
        email,
        cpf,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        role: role || "PATIENT",
        isActive: status === "Ativo",
        profileImageUrl
    }

    const genderConfig = {
        MASCULINE: {
            label: "Masculino",
            icon: Mars,
            className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        },
        FEMININE: {
            label: "Feminino",
            icon: Venus,
            className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
        },
        OTHER: {
            label: "Outro",
            icon: Users,
            className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
        },
    }

    const currentGender = genderConfig[gender as keyof typeof genderConfig] || {
        label: "N/A",
        icon: CircleUser,
        className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
    }

    const GenderIcon = currentGender.icon

    const mockSessions = [
        { date: "10/10/2025", theme: "Ansiedade e rotina", duration: "50 min", status: "Pendente" },
        { date: "03/10/2025", theme: "Autoestima e autoconfiança", duration: "55 min", status: "Concluída" },
    ];

    const patientDataForDetails = {
        id, firstName, lastName, cpf, email, phoneNumber,
        status: status === "Ativo" ? "active" : "inactive",
        sessions: mockSessions,
    }

    return (
        <TableRow className="group cursor-default hover:bg-muted/50 transition-colors">
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    {isDetailsOpen && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Prontuário Digital</DialogTitle>
                                <DialogDescription>Dados completos do paciente.</DialogDescription>
                            </DialogHeader>
                            <PatientsDetails patient={patientDataForDetails as any} />
                        </DialogContent>
                    )}
                </Dialog>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100" onClick={() => setIsDetailsOpen(true)}>
                    <Search className="h-4 w-4" />
                </Button>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={profileImageUrl} alt={`${firstName} ${lastName}`} />
                        <AvatarFallback className="font-medium text-xs bg-primary/10 text-primary">
                            {getInitials(firstName, lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                            {firstName} {lastName}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground" title="CPF">
                    <Fingerprint className="h-3.5 w-3.5 opacity-70" />
                    <span className="font-mono text-xs">{formatCPF(cpf)}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 opacity-70" />
                    <span className="font-mono text-xs">{formatPhone(phoneNumber)}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium">
                        {formatAGE(dateOfBirth)} anos
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(dateOfBirth).toLocaleDateString("pt-BR")}
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate" title={email}>
                {email}
            </TableCell>

            <TableCell>
                <Badge
                    variant="outline"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${currentGender.className}`}
                >
                    <GenderIcon className="h-3 w-3" />
                    {currentGender.label}
                </Badge>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        {isEditOpen && <EditPatient patient={patientDataForEdit} onClose={() => setIsEditOpen(false)} />}
                    </Dialog>

                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        {isDeleteOpen && (
                            <DeletePatientDialog
                                fullName={`${firstName} ${lastName}`}
                                isDeleting={isDeleting}
                                onClose={() => setIsDeleteOpen(false)}
                                onDelete={async () => await deletePatientFn(id)}
                            />
                        )}
                    </Dialog>

                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditOpen(true)}
                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <UserPen className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar dados</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir registro</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}