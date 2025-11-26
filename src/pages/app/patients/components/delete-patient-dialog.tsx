"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { TriangleAlert, Loader2 } from "lucide-react"

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
            toast.success(`Paciente excluído com sucesso!`)
            onClose()
        } catch (err: any) {
            console.error(err)
            const errorMessage = err?.response?.data?.message || "Erro ao excluir. Tente novamente."
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    return (
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0 shadow-xl">
            {/* Cabeçalho Visual com Ícone */}
            <div className="flex flex-col items-center justify-center p-8 pb-6 pt-10 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 shadow-sm">
                        <TriangleAlert className="h-6 w-6 text-red-600" />
                    </div>
                </div>

                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-bold text-zinc-900">
                        Excluir registro?
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="max-w-[85%] text-base text-zinc-500 mx-auto leading-relaxed">
                    Você está prestes a remover <strong>{fullName}</strong>. <br />
                    Essa ação é permanente e não poderá ser desfeita.
                </DialogDescription>

                {/* Área de Erro (Condicional) */}
                {error && (
                    <div className="mt-4 w-full rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
            </div>

            {/* Rodapé com Botões em Grid */}
            <DialogFooter className="grid grid-cols-2 gap-0 border-t bg-zinc-50/50 p-0">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="h-14 w-full rounded-none border-r text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-zinc-100"
                >
                    Cancelar
                </Button>

                <Button
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-14 w-full rounded-none text-base font-bold text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-red-50"
                >
                    {isDeleting ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Excluindo...
                        </span>
                    ) : (
                        "Sim, excluir"
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}