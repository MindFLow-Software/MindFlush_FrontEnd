"use client"

import { useState, useCallback } from "react"
import { Paperclip } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { AttachmentsTableRow } from "./attachments-table-row"
import type { Attachment } from "@/api/attachments"
import { BulkDeleteAction } from "./bulk-delete-action"

interface AttachmentsTableProps {
    attachments: Attachment[]
    isLoading: boolean
    onDelete: (id: string) => void
    perPage?: number
}

export function AttachmentsTable({
    attachments,
    isLoading,
    onDelete,
    perPage = 10,
}: AttachmentsTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const columnCount = 6

    const isAllSelected = attachments.length > 0 && selectedIds.length === attachments.length

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedIds(attachments.map((doc) => doc.id))
        } else {
            setSelectedIds([])
        }
    }, [attachments])

    const handleToggleSelect = useCallback((id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id])
        } else {
            setSelectedIds((prev) => prev.filter((itemId) => itemId !== id))
        }
    }, [])

    const handleBulkDelete = useCallback(() => {
        selectedIds.forEach(id => onDelete(id))
        setSelectedIds([])
    }, [selectedIds, onDelete])

    return (
        <div className="space-y-4 w-full">
            {selectedIds.length > 0 && (
                <BulkDeleteAction
                    selectedCount={selectedIds.length}
                    onConfirm={handleBulkDelete}
                    isDeleting={false} onClear={function (): void {
                    } }                />
            )}

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden w-full">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                            <TableHead className="w-[40px] px-4">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    aria-label="Selecionar todos"
                                    className="cursor-pointer"
                                />
                            </TableHead>

                            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                Arquivo
                            </TableHead>

                            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                Paciente
                            </TableHead>

                            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                Tamanho
                            </TableHead>

                            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                Data de Upload
                            </TableHead>

                            <TableHead className="text-right pr-7 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: perPage }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell className="px-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-[140px]" />
                                                <Skeleton className="h-3 w-[60px]" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-3 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[80px]" /></TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : attachments.length > 0 ? (
                            attachments.map((doc) => (
                                <AttachmentsTableRow
                                    key={doc.id}
                                    attachment={doc}
                                    isSelected={selectedIds.includes(doc.id)}
                                    onSelectChange={(checked) => handleToggleSelect(doc.id, checked)}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-full bg-muted">
                                            <Paperclip className="h-10 w-10 text-muted-foreground/40" />
                                        </div>
                                        <p className="text-sm font-medium">Nenhum documento encontrado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}