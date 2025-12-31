"use client"

import { useState } from "react"
import { Check, X, Search, LucideAward as IdCardLanyard, CalendarDays, Mail } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog } from "@/components/ui/dialog"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { approvePsychologist } from "@/api/approvals"
import { formatAGE } from "@/utils/formatAGE"
import { ApprovalsDetailsDialog } from "./approvals-details-dialog"

export function ApprovalsTableRow({ psychologist }: { psychologist: any }) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const queryClient = useQueryClient()

    const birthDate = psychologist.dateOfBirth ? new Date(psychologist.dateOfBirth) : null
    const createdAt = new Date(psychologist.createdAt)

    const now = new Date()
    const diffInMs = Math.abs(now.getTime() - createdAt.getTime())
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    const getSLAProps = () => {
        if (diffInHours < 24) {
            return {
                label: diffInHours < 1 ? "Agora" : `${diffInHours} Horas`,
                classes:
                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
                dot: "bg-emerald-500",
            }
        }
        if (diffInHours < 48) {
            return {
                label: "1 dia",
                classes: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
                dot: "bg-amber-500",
            }
        }
        return {
            label: `${diffInDays}d`,
            classes: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
            dot: "bg-red-500 animate-pulse",
        }
    }

    const sla = getSLAProps()

    const { mutateAsync: approveMutation, isPending: isApproving } = useMutation({
        mutationFn: approvePsychologist,
        onSuccess: () => {
            toast.success("Psicólogo aprovado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
            setIsDetailsOpen(false)
        },
    })

    return (
        <TableRow className="group hover:bg-muted/50 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary/50">
            <TableCell className="w-[50px]">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg opacity-60 group-hover:opacity-100 group-hover:bg-primary/10 transition-all"
                                onClick={() => setIsDetailsOpen(true)}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                            Ver detalhes
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                        <AvatarImage src={psychologist.profileImageUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                            {psychologist.firstName[0]}
                            {psychologist.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight">
                            {psychologist.firstName} {psychologist.lastName}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">Psicólogo(a)</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                    <IdCardLanyard className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs font-medium">{psychologist.crp || "---"}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1.5 max-w-[180px]">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{psychologist.email}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tabular-nums">
                        {birthDate ? `${formatAGE(birthDate)} anos` : "N/A"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                        <CalendarDays className="h-2.5 w-2.5" />
                        {birthDate?.toLocaleDateString("pt-BR") || "---"}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${sla.dot}`} />
                    {sla.label}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground tabular-nums">{createdAt.toLocaleDateString("pt-BR")}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-right w-[200px]">
                <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="cursor-pointer h-8 w-8 p-0 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-950 bg-transparent"
                                    onClick={() => { }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Rejeitar</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        size="sm"
                        disabled={isApproving}
                        className="cursor-pointer h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
                        onClick={() => approveMutation(psychologist.id)}
                    >
                        <Check className="h-4 w-4 mr-1.5" />
                        <span className="text-xs font-medium">Aprovar</span>
                    </Button>
                </div>
            </TableCell>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                {isDetailsOpen && (
                    <ApprovalsDetailsDialog
                        psychologist={psychologist}
                        onClose={() => setIsDetailsOpen(false)}
                        onApprove={approveMutation}
                    />
                )}
            </Dialog>
        </TableRow>
    )
}
