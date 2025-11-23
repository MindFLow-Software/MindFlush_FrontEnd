"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2, UserPen } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { deleteAppointment } from "@/api/delete-appointment"
import type { Appointment, AppointmentStatus } from "@/api/get-appointment"
import { DeleteAppointmentDialog } from "./delete-appointment-dialog"
import { EditAppointment } from "./edit-appointment-dialog"

interface AppointmentsTableProps {
    appointments: Appointment[]
    isLoading: boolean
    perPage?: number
}

export function AppointmentsTable({ appointments, isLoading, perPage = 10 }: AppointmentsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Paciente</TableHead>
                        <TableHead className="w-[140px]">Diagnóstico</TableHead>
                        <TableHead className="w-40">Notas</TableHead>
                        <TableHead className="w-[180px]">Data/Hora</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[100px]">Opções</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={6}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <AppointmentsTableRowItem
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableHead
                                colSpan={6}
                                className="text-center text-muted-foreground py-10"
                            >
                                <div className="flex flex-col items-center justify-center space-y-1">
                                    <p className="font-medium">Nenhum agendamento encontrado</p>
                                    <p className="text-xs font-normal">Tente alterar os filtros.</p>
                                </div>
                            </TableHead>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}


// Helper de status
function traduzirStatus(status: AppointmentStatus): { texto: string; estilo: string } {
    switch (status) {
        case "SCHEDULED": return { texto: "Agendado", estilo: "bg-blue-100 text-blue-700" }
        case "ATTENDING": return { texto: "Em andamento", estilo: "bg-yellow-100 text-yellow-700" }
        case "FINISHED": return { texto: "Concluído", estilo: "bg-green-100 text-green-700" }
        case "CANCELED": return { texto: "Cancelado", estilo: "bg-red-100 text-red-700" }
        case "NOT_ATTEND": return { texto: "Não compareceu", estilo: "bg-orange-100 text-orange-700" }
        case "RESCHEDULED": return { texto: "Remarcado", estilo: "bg-purple-100 text-purple-700" }
        default: return { texto: "Desconhecido", estilo: "bg-gray-100 text-gray-700" }
    }
}

interface AppointmentRowItemProps {
    appointment: Appointment
}

function AppointmentsTableRowItem({ appointment }: AppointmentRowItemProps) {
    const { id, patient, diagnosis, notes, scheduledAt, status } = appointment
    const { texto, estilo } = traduzirStatus(status)
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Desconhecido"

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const queryClient = useQueryClient()

    const { mutateAsync: deleteAppointmentFn, isPending: isDeleting } = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            toast.success("Agendamento cancelado com sucesso!")
            setIsDeleteOpen(false)
        },
        onError: () => {
            toast.error("Erro ao cancelar agendamento.")
        },
    })

    async function handleDelete() {
        await deleteAppointmentFn(id)
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{patientName}</TableCell>
            <TableCell className="text-muted-foreground">{diagnosis || "—"}</TableCell>
            <TableCell className="text-muted-foreground max-w-[200px] truncate" title={notes || ""}>
                {notes || "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
                {new Date(scheduledAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilo}`}>
                    {texto}
                </span>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    {/* Botão de Editar */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        {isEditOpen && (
                            <EditAppointment
                                appointment={appointment}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
                    </Dialog>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsEditOpen(true)}
                                >
                                    <UserPen className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar Agendamento</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600 transition-colors"
                                    onClick={() => setIsDeleteOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancelar Agendamento</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Dialog de Delete */}
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        {isDeleteOpen && (
                            <DeleteAppointmentDialog
                                isDeleting={isDeleting}
                                onClose={() => setIsDeleteOpen(false)}
                                onDelete={handleDelete}
                            />
                        )}
                    </Dialog>
                </div>
            </TableCell>
        </TableRow>
    )
}