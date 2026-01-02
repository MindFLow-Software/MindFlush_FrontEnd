"use client"

import { useState } from "react"
import { Search, Trash2, UserPen, Mars, Venus, Users, CircleUser, CalendarDays, Phone, Fingerprint, Mail } from "lucide-react"
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
import { Dialog } from "@/components/ui/dialog"
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
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Paciente</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Documento</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Contato</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Idade / Nasc.</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Gênero</TableHead>
                        <TableHead className="text-right pr-6 text-xs uppercase tracking-wider font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={7}>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRowItem key={patient.id} patient={patient} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-20">
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
        id, firstName, lastName, email, cpf, phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender, role: role || "PATIENT",
        isActive: status === "Ativo",
        profileImageUrl
    }

    const genderConfig = {
        MASCULINE: {
            label: "Masculino",
            icon: Mars,
            className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
        },
        FEMININE: {
            label: "Feminino",
            icon: Venus,
            className: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
        },
        OTHER: {
            label: "Outro",
            icon: Users,
            className: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
        },
    }

    const currentGender = genderConfig[gender as keyof typeof genderConfig] || {
        label: "N/A",
        icon: CircleUser,
        className: "bg-muted text-muted-foreground border-transparent"
    }

    const GenderIcon = currentGender.icon

    return (
        <TableRow className="group hover:bg-muted/50 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary/50">
            <TableCell className="w-[50px]">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg opacity-60 group-hover:opacity-100 group-hover:bg-primary/10 transition-all"
                                onClick={() => setIsDetailsOpen(true)}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">Ver prontuário</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm border">
                        <AvatarImage src={profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                            {getInitials(firstName, lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight text-foreground">
                            {firstName} {lastName}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">Paciente</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-transparent group-hover:border-muted-foreground/10 transition-colors font-mono text-xs font-medium tabular-nums">
                    <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatCPF(cpf)}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium tabular-nums">{formatPhone(phoneNumber)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-70">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-[10px] truncate max-w-[140px] lowercase">{email}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums tracking-tight">
                        {formatAGE(dateOfBirth)} anos
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1 uppercase font-medium">
                        <CalendarDays className="h-2.5 w-2.5" />
                        {new Date(dateOfBirth).toLocaleDateString("pt-BR")}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <Badge
                    variant="outline"
                    className={`h-[20px] px-2 text-[10px] font-bold uppercase tracking-tight gap-1.5 ${currentGender.className}`}
                >
                    <GenderIcon className="h-3 w-3" />
                    {currentGender.label}
                </Badge>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end gap-2 pr-2">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditOpen(true)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                >
                                    <UserPen className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Excluir</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>

            {/* DIALOGS - CENTRALIZADOS */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                {isDetailsOpen && <PatientsDetails patientId={id} />}
            </Dialog>

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
        </TableRow>
    )
}