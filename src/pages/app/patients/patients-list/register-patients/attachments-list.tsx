"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FileText, Loader2, ArrowDownToLine } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FieldSet } from "@/components/ui/field"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getPatientAttachments, deleteAttachment } from "@/api/attachments"
import { handleFileDownload } from "@/utils/handle-file-download"
import { Label } from "@/components/ui/label"
import { DeleteActionButton } from "./delete-attachments-button"

interface AttachmentsListProps {
    patientId: string
}

export function AttachmentsList({ patientId }: AttachmentsListProps) {
    const queryClient = useQueryClient()

    const { data: attachments, isLoading } = useQuery({
        queryKey: ["attachments", patientId],
        queryFn: () => getPatientAttachments(patientId),
        // 🟢 Adicionado staleTime para evitar refetch excessivo durante uploads
        staleTime: 1000 * 60 * 5,
    })

    const { mutateAsync: removeFn, isPending: isRemoving } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: async () => {
            // Invalida a query para forçar o refresh da lista
            await queryClient.invalidateQueries({
                queryKey: ["attachments", patientId],
            })
            toast.success("Documento removido.")
        },
        onError: () => {
            toast.error("Erro ao excluir o arquivo.")
        }
    })

    return (
        <div className="pt-2">
            <div className="flex items-center mb-3 px-1">
                <Label className="block font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Documentos e Anexos ({attachments?.length || 0})
                </Label>
            </div>

            <FieldSet className="border-none p-0 shadow-none">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500/50" />
                    </div>
                ) : !attachments || attachments.length === 0 ? (
                    <Empty className="py-10 border-none bg-muted/10 rounded-xl">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia className="opacity-20 mb-2">
                                <FileText className="h-10 w-10" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xs font-medium text-muted-foreground text-center">
                                Nenhum documento encontrado para este paciente.
                            </EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                        {attachments.map((file) => (
                            <div
                                key={file.id}
                                className="group flex items-center justify-between p-3 rounded-xl border bg-card/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-foreground truncate">
                                            {file.filename}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                            {format(new Date(file.uploadedAt), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            handleFileDownload(file.id, file.filename)
                                        }}
                                    >
                                        <ArrowDownToLine className="h-4 w-4" />
                                    </Button>

                                    <DeleteActionButton
                                        onDelete={() => removeFn(file.id)}
                                        itemName={file.filename}
                                        isLoading={isRemoving}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
}