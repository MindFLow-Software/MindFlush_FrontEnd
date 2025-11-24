"use client"

import { useState } from "react"
import { Search, Trash2, UserPen, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Importe seus componentes de edição se existirem
import { EditAppointment } from "./edit-appointment-dialog"

// APIs reais
import { deleteAppointment } from "@/api/delete-appointment"
import type { Appointment, AppointmentStatus } from "@/api/get-appointment"

// Mock temporário para iniciar (substitua pela importação real quando tiver)
async function startAppointment(_id: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
}

interface AppointmentProps {
    appointment: Appointment
}

function traduzirStatus(status: AppointmentStatus): { texto: string; estilo: string } {
    switch (status) {
        case "SCHEDULED": return { texto: "Agendado", estilo: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" }
        case "ATTENDING": return { texto: "Em andamento", estilo: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" }
        case "FINISHED": return { texto: "Concluído", estilo: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
        case "CANCELED": return { texto: "Cancelado", estilo: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
        case "NOT_ATTEND": return { texto: "Não compareceu", estilo: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" }
        case "RESCHEDULED": return { texto: "Remarcado", estilo: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" }
        default: return { texto: "Desconhecido", estilo: "bg-gray-100 text-gray-700" }
    }
}

export function AppointmentsTableRow({ appointment }: AppointmentProps) {
    const { id, patient, diagnosis, notes, scheduledAt, status } = appointment
    const { texto, estilo } = traduzirStatus(status)
    const patientName = `${patient.firstName} ${patient.lastName}`

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const queryClient = useQueryClient()

    // Mutation para Excluir/Cancelar
    const { mutateAsync: deleteAppointmentFn, isPending: isDeleting } = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            toast.success("Agendamento cancelado/excluído com sucesso!")
            setIsDeleteDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
        },
        onError: () => toast.error("Erro ao excluir agendamento.")
    })

    // Mutation para Iniciar
    const { mutateAsync: startAppointmentFn, isPending: isStarting } = useMutation({
        mutationFn: startAppointment,
        onSuccess: () => {
            toast.success("Sessão iniciada!")
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
        }
    })

    async function handleDelete() {
        await deleteAppointmentFn(id)
    }

    const isPast = new Date(scheduledAt).getTime() < Date.now();
    const canBeStarted = status === "SCHEDULED" && !isPast;
    const canBeEdited = status !== "FINISHED" && status !== "CANCELED";
    const canBeDeleted = true;

    return (
        <TableRow>
            {/* 🔍 Coluna de Detalhes */}
            <TableCell>
                <Dialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="xs">
                                        <Search className="h-3 w-3" />
                                        <span className="sr-only">Detalhes da consulta</span>
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Ver detalhes</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Detalhes do Agendamento</DialogTitle>
                            <DialogDescription>Informações completas da consulta.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold">Paciente:</span>
                                <span className="col-span-3">{patientName}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold">Diagnóstico:</span>
                                <span className="col-span-3">{diagnosis}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold">Data:</span>
                                <span className="col-span-3">
                                    {format(new Date(scheduledAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold">Notas:</span>
                                <span className="col-span-3 text-muted-foreground">{notes || "Nenhuma nota registrada."}</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </TableCell>

            <TableCell className="font-medium">{patientName}</TableCell>

            <TableCell className="text-muted-foreground truncate max-w-[140px] text-sm">
                {diagnosis}
            </TableCell>

            <TableCell className="text-muted-foreground truncate max-w-[140px] text-sm">
                {notes || "—"}
            </TableCell>

            <TableCell className="text-muted-foreground">
                {format(new Date(scheduledAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </TableCell>

            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilo}`}>
                    {texto}
                </span>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <TooltipProvider>

                        {/* Botão Iniciar */}
                        {canBeStarted && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => startAppointmentFn(id)}
                                        disabled={isStarting}
                                    >
                                        {isStarting ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3 text-green-600" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Iniciar Sessão</TooltipContent>
                            </Tooltip>
                        )}

                        {/* Botão Editar */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            disabled={!canBeEdited}
                                            className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600 transition-colors disabled:opacity-50"
                                        >
                                            <UserPen className="h-4 w-4" />
                                            <span className="sr-only">Editar agendamento</span>
                                        </Button>
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Editar agendamento</TooltipContent>
                            </Tooltip>
                            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                <EditAppointment
                                    appointment={appointment}
                                    onClose={() => setIsEditDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>

                        {/* Botão Excluir/Cancelar */}
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            disabled={!canBeDeleted}
                                            className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Excluir agendamento</span>
                                        </Button>
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Excluir agendamento</TooltipContent>
                            </Tooltip>

                            <DialogContent className="max-w-md">
                                <div className="space-y-4">
                                    <DialogHeader>
                                        <DialogTitle>Excluir agendamento</DialogTitle>
                                        <DialogDescription>
                                            Tem certeza que deseja excluir o agendamento de <strong>{patientName}</strong>?
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDeleteDialogOpen(false)}
                                            disabled={isDeleting}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}