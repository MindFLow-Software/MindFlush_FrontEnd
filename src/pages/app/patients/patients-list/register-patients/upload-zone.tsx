"use client"

import { useRef, memo, useCallback } from "react"
import { CloudUpload, FileText, X, AlertCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FieldSet } from "@/components/ui/field"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"

interface UploadZoneProps {
    selectedFiles: File[]
    onFilesChange: (files: File[]) => void
}

const MAX_FILE_SIZE = 1024 * 1024 * 3 // 3MB
const MAX_FILES = 6 // 🟢 Limite de segurança solicitado

export const UploadZone = memo(({ selectedFiles, onFilesChange }: UploadZoneProps) => {
    const documentsInputRef = useRef<HTMLInputElement>(null)

    const triggerFileInput = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation() // 🟢 Impede que o clique feche modais externos
        documentsInputRef.current?.click()
    }, [])

    const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newFiles = Array.from(files)

        // 1. Validação de Quantidade Total (Segurança)
        if (selectedFiles.length + newFiles.length > MAX_FILES) {
            toast.error("Limite de arquivos excedido", {
                description: `Você pode ter no máximo ${MAX_FILES} arquivos selecionados.`,
                icon: <AlertCircle className="size-4 text-red-500" />
            })
            e.target.value = "" // Reset do input
            return
        }

        // 2. Filtro de Tamanho (3MB)
        const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE)

        // 3. Filtro de Válidos (Tamanho OK e não duplicados)
        const validNewFiles = newFiles.filter(newFile => {
            const isOversized = newFile.size > MAX_FILE_SIZE
            const isDuplicate = selectedFiles.some(
                f => f.name === newFile.name && f.size === newFile.size
            )
            return !isOversized && !isDuplicate
        })

        // 4. Notificações de Erro de Tamanho
        if (oversizedFiles.length > 0) {
            oversizedFiles.forEach(file => {
                toast.error(`O arquivo "${file.name}" é muito grande.`, {
                    description: "O limite por arquivo é de 3MB."
                })
            })
        }

        // 5. Atualização do Estado
        if (validNewFiles.length > 0) {
            onFilesChange([...selectedFiles, ...validNewFiles])
            toast.success(`${validNewFiles.length} arquivo(s) adicionado(s).`)
        }

        // 🟢 Importante: Resetar o valor para permitir selecionar o mesmo arquivo após deletar
        e.target.value = ""
    }

    const handleRemoveDocument = (e: React.MouseEvent, indexToRemove: number) => {
        e.preventDefault()
        e.stopPropagation() // 🟢 Impede que a remoção dispare ações no Modal pai

        const updatedList = selectedFiles.filter((_, index) => index !== indexToRemove)
        onFilesChange(updatedList)
    }

    return (
        <div className="pt-2 border-t mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2 px-1">
                <legend className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 pt-2 w-full uppercase tracking-wider">
                    <ShieldCheck className="size-3 text-blue-500" />
                    Novos Documentos (Máx {MAX_FILES} arquivos • 3MB)
                </legend>

                {selectedFiles.length > 0 && selectedFiles.length < MAX_FILES && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={triggerFileInput}
                        className="h-7 text-[10px] uppercase font-bold text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                        + Adicionar mais
                    </Button>
                )}
            </div>

            <input
                type="file"
                ref={documentsInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleDocumentsSelect}
            />

            <FieldSet className="p-0 border-none shadow-none">
                {selectedFiles.length === 0 ? (
                    <Empty
                        className="border-2 border-dashed py-8 mt-1 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer rounded-xl"
                        onClick={triggerFileInput}
                    >
                        <EmptyHeader>
                            <EmptyMedia>
                                <CloudUpload className="h-10 w-10 text-zinc-500/90" />
                            </EmptyMedia>
                            <EmptyTitle className="text-sm font-semibold text-foreground">
                                Clique para anexar arquivos
                            </EmptyTitle>
                            <EmptyDescription className="text-xs">
                                PDFs ou Imagens (Máximo de {MAX_FILES} arquivos)
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 gap-2 mt-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-card rounded-xl border shadow-sm group animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold truncate text-foreground">{file.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                            {(file.size / 1024).toFixed(0)} KB • {file.type.split('/')[1] || 'Doc'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => handleRemoveDocument(e, index)}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
})

UploadZone.displayName = "UploadZone"