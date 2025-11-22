"use client"

import { useState } from "react"
import { Search, Trash2, UserPen } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface PatientsTableProps {
    patients: Patient[]
    isLoading: boolean
    perPage?: number
}

export function PatientsTable({ patients, isLoading, perPage = 10 }: PatientsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16" />
                        <TableHead className="w-[140px]">CPF</TableHead>
                        <TableHead className="w-40">Paciente</TableHead>
                        <TableHead className="w-[140px]">Telefone</TableHead>
                        <TableHead className="w-40">Data de Nascimento</TableHead>
                        <TableHead className="w-[140px]">Email</TableHead>
                        <TableHead className="w-[140px]">Gênero</TableHead>
                        <TableHead className="w-[140px]">Opções</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={i}>
                                <TableHead colSpan={9}>
                                    <Skeleton className="h-8 w-full" />
                                </TableHead>
                            </TableRow>
                        ))
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRowItem key={patient.id} patient={patient} />
                        ))
                    ) : (
                        <TableRow>
                            <TableHead colSpan={9} className="text-center text-muted-foreground py-6">
                                Nenhum paciente cadastrado.
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

    const genderLabel = {
        MASCULINE: "Masculino",
        FEMININE: "Feminino",
        OTHER: "Outro",
    }[gender] || "Não informado"

    // Mocking the sessions data for PatientsDetails (assuming it's not available in the Patient type)
    const mockSessions = [
        { date: "10/10/2025", theme: "Ansiedade e rotina", duration: "50 min", status: "Pendente" },
        { date: "03/10/2025", theme: "Autoestima e autoconfiança", duration: "55 min", status: "Concluída" },
    ];

    // Cria o objeto PatientData completo para o componente PatientsDetails
    const patientDataForDetails = {
        id,
        firstName,
        lastName,
        cpf,
        email,
        phoneNumber,
        status: status === "Ativo" ? "active" : "inactive", // Mapeia para um status compatível com PatientsDetails
        sessions: mockSessions, // Usando o mock
    }

    return (
        <TableRow>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    {/* Renderiza o DialogContent apenas se aberto */}
                    {isDetailsOpen && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Detalhes do Paciente</DialogTitle>
                                <DialogDescription>Visualização completa dos dados cadastrais.</DialogDescription>
                            </DialogHeader>
                            {/* PASSA OS DADOS DO PACIENTE AQUI */}
                            <PatientsDetails patient={patientDataForDetails as any} /> 
                        </DialogContent>
                    )}
                </Dialog>

                <Button
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsDetailsOpen(true)
                    }}
                >
                    <Search className="h-3 w-3" />
                    <span className="sr-only">Detalhes</span>
                </Button>
            </TableCell>

            <TableCell className="font-medium">{cpf}</TableCell>
            <TableCell className="font-medium">{firstName} {lastName}</TableCell>
            <TableCell className="text-muted-foreground">{phoneNumber}</TableCell>
            <TableCell className="text-muted-foreground">{new Date(dateOfBirth).toLocaleDateString("pt-BR")}</TableCell>
            <TableCell className="text-muted-foreground">{email}</TableCell>
            <TableCell className="text-muted-foreground">{genderLabel}</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        {isEditOpen && (
                            <EditPatient
                                patient={patientDataForEdit}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
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

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsEditOpen(true)
                                    }}
                                    className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                    <UserPen className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Editar paciente</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsDeleteOpen(true)
                                    }}
                                    className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Excluir paciente</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}