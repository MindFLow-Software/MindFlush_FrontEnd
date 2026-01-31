"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface CancelAppointmentDialogProps {
    patientName: string
    isCancelling: boolean
    onClose: () => void
    onCancel: () => Promise<void>
}

export function CancelAppointmentDialog({
    patientName,
    isCancelling,
    onClose,
    onCancel
}: CancelAppointmentDialogProps) {
    return (
        <DialogContent className="max-w-[400px]">
            <DialogHeader>
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <DialogTitle>Cancelar Sessão</DialogTitle>
                </div>
                <DialogDescription>
                    Você tem certeza que deseja cancelar o agendamento de <strong>{patientName}</strong>?
                    O horário será liberado imediatamente no calendário.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" onClick={onClose} disabled={isCancelling}>
                    Voltar
                </Button>
                <Button
                    variant="destructive"
                    onClick={onCancel}
                    disabled={isCancelling}
                    className="bg-orange-600 hover:bg-orange-700"
                >
                    {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Cancelamento"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}