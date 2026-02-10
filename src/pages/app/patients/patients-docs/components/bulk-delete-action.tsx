"use client"

import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BulkDeleteActionProps {
    selectedCount: number
    onConfirm: () => void
    isDeleting?: boolean
}

export function BulkDeleteAction({ selectedCount, onConfirm, isDeleting }: BulkDeleteActionProps) {
    if (selectedCount === 0) return null

    return (
        <div className="flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-2 ml-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="size-3 text-red-600" />
                </div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-tight">
                    {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        className="h-8 text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] 
                        active:scale-95 bg-red-400 text-white hover:bg-red-600 cursor-pointer"
                    >
                        {isDeleting ? (
                            <Loader2 className="size-3 mr-2 animate-spin" />
                        ) : (
                            <Trash2 className="size-3 mr-2" />
                        )}
                        Excluir Seleção
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="size-5" />
                            Confirmar Exclusão em Massa
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground">
                            Você está prestes a excluir <strong>{selectedCount}</strong> documentos permanentemente.
                            Esta ação não pode ser desfeita. Deseja continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                onConfirm()
                            }}
                            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        >
                            Sim, excluir tudo
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}