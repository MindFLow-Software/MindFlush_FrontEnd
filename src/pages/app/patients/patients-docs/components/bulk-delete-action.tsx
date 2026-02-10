"use client"

import { Trash2, Loader2, X, Download } from "lucide-react"
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
    onClear: () => void
    isDeleting?: boolean
}

export function BulkDeleteAction({ selectedCount, onConfirm, onClear, isDeleting }: BulkDeleteActionProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-foreground text-background rounded-xl shadow-2xl border border-border/10">
                <button
                    onClick={onClear}
                    className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-background/15 transition-colors cursor-pointer"
                    aria-label="Limpar seleção"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="h-5 w-px bg-background/20" />

                <span className="text-sm font-medium tabular-nums whitespace-nowrap">
                    {selectedCount} {selectedCount === 1 ? "selecionado" : "selecionados"}
                </span>

                <div className="h-5 w-px bg-background/20" />

                <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs font-medium bg-background/15 text-background border-0 hover:bg-background/25 cursor-pointer"
                    onClick={() => {
                        /* download handler */
                    }}
                >
                    <Download className="h-3.5 w-3.5" />
                    Baixar
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            className="h-8 text-xs font-medium cursor-pointer"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Excluir
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </div>
                                Confirmar exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground">
                                Você está prestes a excluir{" "}
                                <strong className="text-foreground">{selectedCount}</strong>{" "}
                                {selectedCount === 1 ? "documento" : "documentos"} permanentemente.
                                Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault()
                                    onConfirm()
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            >
                                Sim, excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
