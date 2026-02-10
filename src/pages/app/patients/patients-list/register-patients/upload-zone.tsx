"use client"

import { useRef, memo, useCallback } from "react"
import { CloudUpload, FileText, Paperclip, X } from "lucide-react"
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

export const UploadZone = memo(({ selectedFiles, onFilesChange }: UploadZoneProps) => {
    const documentsInputRef = useRef<HTMLInputElement>(null)

    const triggerFileInput = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        documentsInputRef.current?.click()
    }, [])

    const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)

            const filteredNewFiles = newFiles.filter(
                newFile => !selectedFiles.some(f => f.name === newFile.name && f.size === newFile.size)
            )

            onFilesChange([...selectedFiles, ...filteredNewFiles])
        }
        // Limpa para permitir re-seleção
        e.target.value = ""
    }

    const handleRemoveDocument = (e: React.MouseEvent, indexToRemove: number) => {
        e.preventDefault()
        e.stopPropagation()
        const updatedList = selectedFiles.filter((_, index) => index !== indexToRemove)
        onFilesChange(updatedList)
    }

    return (
        <div className="pt-2 border-t mt-4">
            <div className="flex items-center justify-between mb-2">
                <legend className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 pt-2 w-full uppercase tracking-wider">
                    <Paperclip className="size-3 text-blue-500" />
                    Novos Documentos (PDF, PNG, JPG)
                </legend>
                {selectedFiles.length > 0 && (
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
                                Arraste ou clique para anexar
                            </EmptyTitle>
                            <EmptyDescription className="text-xs">
                                PDFs de exames, laudos ou fotos clínicas
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 gap-2 mt-1 max-h-48 overflow-y-auto pr-1">
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
                                            {(file.size / 1024).toFixed(0)} KB • {file.type.split('/')[1]}
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