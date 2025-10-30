"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface DeletePatientProps {
    fullName: string
    onClose: () => void
    onDelete: () => Promise<void>
    isDeleting: boolean
}

export function DeletePatientDialog({ fullName, onClose, onDelete, isDeleting }: DeletePatientProps) {
    const [error, setError] = useState<string | null>(null)

    async function handleDelete() {
        try {
            setError(null)
            await onDelete()
            toast.success(`Paciente ${fullName} excluído com sucesso!`) // <- feedback de sucesso
            onClose()
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "Erro ao excluir paciente"
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Excluir paciente</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja excluir <strong>{fullName}</strong>? Essa ação é irreversível.
                </DialogDescription>
            </DialogHeader>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <DialogFooter className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                    Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
