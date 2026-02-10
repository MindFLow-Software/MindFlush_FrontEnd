"use client"

import { useState } from "react"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"

interface DeleteActionButtonProps {
    onDelete: () => Promise<void>
    itemName?: string
    isLoading?: boolean
    className?: string
}

export function DeleteActionButton({
    onDelete,
    itemName,
    isLoading = false,
    className
}: DeleteActionButtonProps) {
    const [open, setOpen] = useState(false)

    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
            await onDelete()
            setOpen(false)
        } catch (error) {
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    className={cn(
                        "cursor-pointer h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                        className
                    )}
                >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-[400px] rounded-2xl bg-card border-border text-foreground">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                            Excluir arquivo?
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        A exclusão de <span className="font-semibold text-foreground break-all">{itemName}</span> é permanente e não poderá ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="cursor-pointer rounded-xl border-none bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-red-500 text-white hover:bg-red-600 rounded-xl
                        font-bold transition-all cursor-pointer"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}