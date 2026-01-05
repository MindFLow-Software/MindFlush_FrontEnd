"use client"

import { useState } from "react"
import {
    Search, Trash2, UserCheck, UserPen, Mars, Venus, Users,
    CalendarDays, Phone, Fingerprint, AtSign, CheckCircle2, XCircle
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { PatientsDetails } from "./patients-details"
import { EditPatient } from "./edit-patient-dialog"
import { DeletePatientDialog } from "./delete-patient-dialog"
import { deletePatients } from "@/api/delete-patients"

import type { UpdatePatientData } from "@/api/upadate-patient"
import type { Patient } from "@/api/get-patients"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { formatAGE } from "@/utils/formatAGE"

interface PatientsTableRowProps {
    patient: Patient
}

const getInitials = (first = "", last = "") => {
    const f = first.charAt(0).toUpperCase()
    const l = last.charAt(0).toUpperCase()
    return `${f}${l}` || "??"
}

export function PatientsTableRow({ patient }: PatientsTableRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const queryClient = useQueryClient()

    const { id, firstName, lastName, email, cpf, phoneNumber, dateOfBirth, gender, profileImageUrl, isActive } = patient

    const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
        mutationFn: () => deletePatients(id, !isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
        }
    })

    const isValidDate = dateOfBirth && !isNaN(new Date(dateOfBirth).getTime())

    const patientDataForEdit: UpdatePatientData = {
        id, firstName, lastName, email, cpf, phoneNumber,
        dateOfBirth: isValidDate ? new Date(dateOfBirth) : new Date(),
        gender, role: (patient as any).role || "PATIENT", isActive, profileImageUrl: profileImageUrl || ""
    }

    const genderConfig = {
        MASCULINE: { label: "Masculino", icon: Mars, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
        FEMININE: { label: "Feminino", icon: Venus, className: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
        OTHER: { label: "Outro", icon: Users, className: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" },
    }

    const currentGender = genderConfig[gender as keyof typeof genderConfig] || genderConfig.OTHER

    return (
        <TableRow
            className={`group hover:bg-muted/50 transition-all border-l-2 border-l-transparent hover:border-l-primary/50 
      ${!isActive ? 'opacity-60 bg-muted/20' : ''}`}
        >
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
                        <AvatarImage src={profileImageUrl || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                            {getInitials(firstName, lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight text-foreground text-nowrap">{firstName} {lastName}</span>
                        <span className="text-[11px] text-muted-foreground/70">Paciente</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                {isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <CheckCircle2 className="h-3 w-3" /> Ativo
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <XCircle className="h-3 w-3" /> Inativo
                    </Badge>
                )}
            </TableCell>

            <TableCell>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-transparent font-mono text-xs font-medium tabular-nums">
                    <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" />
                    {cpf ? formatCPF(cpf) : "---"}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium tabular-nums">{phoneNumber ? formatPhone(phoneNumber) : "---"}</span>
                </div>
            </TableCell>

            <TableCell>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-help">
                                <AtSign className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="text-xs font-medium tabular-nums truncate max-w-[150px]">
                                    {email || "---"}
                                </span>
                            </div>
                        </TooltipTrigger>
                        {email && <TooltipContent className="text-xs font-medium">{email}</TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums tracking-tight">
                        {isValidDate ? `${formatAGE(dateOfBirth)} anos` : "N/A"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1 uppercase font-medium">
                        <CalendarDays className="h-2.5 w-2.5" />
                        {isValidDate ? new Date(dateOfBirth).toLocaleDateString("pt-BR") : "---"}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <Badge variant="outline" className={`h-[20px] px-2 text-[10px] font-bold uppercase tracking-tight gap-1.5 ${currentGender.className}`}>
                    <currentGender.icon className="h-3 w-3" />
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
                                    className="h-8 w-8 rounded-lg transition-colors text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
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
                                    className={`h-8 w-8 rounded-lg transition-colors text-muted-foreground ${isActive
                                            ? 'hover:text-red-600 hover:bg-red-50'
                                            : 'hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                >
                                    {isActive ? <Trash2 className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">{isActive ? 'Inativar' : 'Reativar'}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>

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
                        isActive={isActive}
                        isPending={isUpdating}
                        onClose={() => setIsDeleteOpen(false)}
                        onInactivate={async () => await toggleStatusFn()}
                    />
                )}
            </Dialog>
        </TableRow>
    )
}