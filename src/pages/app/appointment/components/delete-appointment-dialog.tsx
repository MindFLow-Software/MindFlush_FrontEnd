import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteAppointmentDialogProps {
    isDeleting: boolean
    onClose: () => void
    onDelete: () => Promise<void>
}

export function DeleteAppointmentDialog({
    isDeleting,
    onClose,
    onDelete,
}: DeleteAppointmentDialogProps) {
    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Cancelar Agendamento</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja excluir este agendamento?
                    <br />
                    Essa ação não pode ser desfeita e o horário ficará disponível novamente.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                </DialogClose>

                <Button
                    type="button"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Excluindo..." : "Sim, excluir"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}