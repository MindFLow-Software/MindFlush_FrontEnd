"use client"

import {
    FileText,
    ExternalLink,
    Trash2,
    User,
    Loader2
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Attachment } from "@/api/attachments"

interface AttachmentsTableProps {
    attachments: Attachment[]
    isLoading: boolean
    onDelete: (id: string) => void
}

export function AttachmentsTable({ attachments, isLoading, onDelete }: AttachmentsTableProps) {
    const formatBytes = (bytes: number | undefined | null) => {
        const value = Number(bytes)
        if (isNaN(value) || value <= 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(value) / Math.log(k))
        const unitIndex = Math.min(i, sizes.length - 1)
        return `${parseFloat((value / Math.pow(k, unitIndex)).toFixed(2))} ${sizes[unitIndex]}`
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="text-[10px] uppercase font-bold tracking-wider">Arquivo</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold tracking-wider">Paciente</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold tracking-wider">Tamanho</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold tracking-wider">Data</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold tracking-wider text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="p-8 text-center">
                                <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                            </TableCell>
                        </TableRow>
                    ) : attachments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground italic">
                                Nenhum documento encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        attachments.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-muted/20 transition-colors group">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                                            <FileText className="size-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold text-foreground truncate max-w-[200px]">{doc.filename}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{doc.contentType.split('/')[1] || 'FILE'}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {doc.patient ? (
                                        <div className="flex items-center gap-2">
                                            <User className="size-3 text-muted-foreground" />
                                            <span className="text-xs font-medium">{doc.patient.firstName} {doc.patient.lastName}</span>
                                        </div>
                                    ) : (
                                        <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter opacity-50 font-bold">Sem Vínculo</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-[10px] font-medium text-muted-foreground">{formatBytes(doc.SizeInBytes)}</TableCell>
                                <TableCell className="text-[10px] text-muted-foreground font-medium">
                                    {doc.uploadedAt ? format(new Date(doc.uploadedAt), "dd/MM/yyyy", { locale: ptBR }) : '--/--/----'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary cursor-pointer transition-colors" onClick={() => doc.fileUrl && window.open(doc.fileUrl, '_blank')}>
                                            <ExternalLink className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive cursor-pointer transition-colors" onClick={() => onDelete(doc.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}