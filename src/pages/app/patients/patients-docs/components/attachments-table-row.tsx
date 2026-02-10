"use client"

import { FileText, Trash2, Download, User, CalendarDays, PackageOpen } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { handleFileDownload } from "@/utils/handle-file-download"
import type { Attachment } from "@/api/attachments"

interface AttachmentsTableRowProps {
    attachment: Attachment
    isSelected: boolean
    onSelectChange: (checked: boolean) => void
    onDelete: (id: string) => void
}

export function AttachmentsTableRow({ attachment, isSelected, onSelectChange, onDelete }: AttachmentsTableRowProps) {
    const { id, filename, contentType, SizeInBytes, uploadedAt, patient } = attachment

    const formatBytes = (bytes: number | undefined | null) => {
        const value = Number(bytes)
        if (isNaN(value) || value <= 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(value) / Math.log(k))
        const unitIndex = Math.min(i, sizes.length - 1)
        return `${parseFloat((value / Math.pow(k, unitIndex)).toFixed(2))} ${sizes[unitIndex]}`
    }

    const fileType = contentType.split('/')[1]?.toUpperCase() || 'FILE'

    return (
        <TooltipProvider delayDuration={200}>
            <TableRow
                className={cn(
                    "group hover:bg-muted/50 transition-all border-l-2 border-l-transparent",
                    isSelected ? "bg-primary/5 border-l-primary/50" : "hover:border-l-primary/30"
                )}
            >
                <TableCell className="px-4">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectChange(!!checked)}
                        aria-label={`Selecionar ${filename}`}
                        className="cursor-pointer"
                    />
                </TableCell>

                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-lg border border-primary/10 group-hover:bg-primary/10 transition-colors">
                            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="font-semibold text-sm leading-tight text-foreground truncate max-w-[180px] cursor-default">
                                        {filename}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs font-medium">
                                    {filename}
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-[11px] text-muted-foreground/70 uppercase font-medium tracking-tighter">
                                {fileType}
                            </span>
                        </div>
                    </div>
                </TableCell>

                <TableCell>
                    {patient ? (
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-muted/50">
                                <User className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                            </div>
                            <span className="text-xs font-medium text-foreground">
                                {patient.firstName} {patient.lastName}
                            </span>
                        </div>
                    ) : (
                        <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 text-[10px] font-bold uppercase tracking-tight h-[20px]">
                            Sem vínculo
                        </Badge>
                    )}
                </TableCell>

                <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-transparent font-mono text-xs font-medium tabular-nums">
                        <PackageOpen className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        {formatBytes(SizeInBytes)}
                    </div>
                </TableCell>

                <TableCell>
                    <div className="flex flex-col tabular-nums">
                        <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1 uppercase font-medium">
                            <CalendarDays className="h-2.5 w-2.5" aria-hidden="true" />
                            Enviado em
                        </span>
                        <span className="text-sm font-semibold tracking-tight">
                            {uploadedAt ? format(new Date(uploadedAt), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                        </span>
                    </div>
                </TableCell>

                <TableCell className="text-right">
                    <div className="flex justify-end gap-2 pr-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="cursor-pointer h-8 w-8 rounded-lg transition-all text-muted-foreground hover:text-blue-600 hover:bg-blue-100/50 focus-visible:ring-2 focus-visible:ring-blue-500"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleFileDownload(id, filename)
                                    }}
                                >
                                    <Download className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-medium">Download</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    type="button"
                                    className="cursor-pointer h-8 w-8 rounded-lg transition-all text-muted-foreground hover:text-red-600 hover:bg-red-100/50 focus-visible:ring-2 focus-visible:ring-red-500"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onDelete(id)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-medium">Excluir</TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    )
}