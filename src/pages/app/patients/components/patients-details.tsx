"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ClockIcon, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getPatientDetails } from "@/api/get-patient-details"
import { usePsychologistProfile } from "@/hooks/use-psychologist-profile"
import { IMaskMixin } from "react-imask"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Button } from "@/components/ui/button"

import { PaginationDetailsPatients } from "@/components/pagination-details-patients"
import { EvolutionViewer } from "../docs/evolution-viewer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PatientsDetailsProps {
    patientId: string
}

const MaskedInfo = IMaskMixin(({ inputRef, ...props }: any) => (
    <input
        ref={inputRef}
        disabled
        className="bg-transparent border-none w-full text-right p-0 pointer-events-none font-medium tabular-nums focus:outline-none disabled:opacity-100 text-foreground h-auto"
        {...props}
    />
))

export function PatientsDetails({ patientId }: PatientsDetailsProps) {
    const [pageIndex, setPageIndex] = useState(0)
    const [selectedSession, setSelectedSession] = useState<any | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["patient-details", patientId, pageIndex],
        queryFn: () => getPatientDetails(patientId, pageIndex),
        enabled: !!patientId,
    })

    const { data: profile } = usePsychologistProfile()

    if (isLoading || !data) {
        return (
            <DialogContent className="flex items-center justify-center p-20">
                <DialogTitle className="sr-only">Carregando detalhes</DialogTitle>
                <DialogDescription className="sr-only">Aguarde enquanto carregamos os dados do paciente</DialogDescription>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </DialogContent>
        )
    }

    const { patient, meta } = data

    const getStatusLabel = (status: string) => {
        const s = status?.toUpperCase()
        const statuses: Record<string, { label: string; color: string }> = {
            SCHEDULED: { label: "Agendado", color: "text-blue-500" },
            ATTENDING: { label: "Em andamento", color: "text-amber-500" },
            FINISHED: { label: "Concluída", color: "text-green-500" },
            CONCLUÍDA: { label: "Concluída", color: "text-green-500" },
            CANCELED: { label: "Cancelado", color: "text-red-500" },
            NOT_ATTEND: { label: "Não compareceu", color: "text-orange-500" },
            RESCHEDULED: { label: "Remarcado", color: "text-purple-500" },
        }
        return statuses[s] || { label: status, color: "text-yellow-500" }
    }

    const totalFinished = patient.sessions.filter((session: any) => {
        const s = session.status?.toUpperCase()
        return s === "FINISHED" || s === "CONCLUÍDA" || s === "CONCLUIDO"
    }).length

    return (
        <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
            <DialogHeader className={selectedSession ? "sr-only" : ""}>
                <DialogTitle>
                    {selectedSession
                        ? `Evolução - ${format(parseISO(selectedSession.date), "dd/MM/yyyy", { locale: ptBR })}`
                        : `Paciente: ${patient.firstName} ${patient.lastName}`}
                </DialogTitle>
                <DialogDescription>
                    {selectedSession
                        ? "Visualização detalhada do prontuário eletrônico"
                        : "Detalhes do paciente e histórico de sessões"}
                </DialogDescription>
            </DialogHeader>

            {selectedSession ? (
                <EvolutionViewer
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    content={selectedSession.content || ""}
                    date={selectedSession.sessionDate || selectedSession.date || selectedSession.createdAt}
                    diagnosis={selectedSession.theme}
                    psychologist={{
                        name: profile
                            ? `${profile.firstName} ${profile.lastName}`.trim()
                            : "Psicólogo Responsável",
                        crp: profile?.crp || ""
                    }}
                    onBack={() => setSelectedSession(null)}
                />
            ) : (
                <div className="space-y-6">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Nome completo</TableCell>
                                <TableCell className="flex justify-end font-medium">
                                    {patient.firstName} {patient.lastName}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">CPF</TableCell>
                                <TableCell className="flex justify-end font-medium tabular-nums">
                                    <MaskedInfo
                                        mask="000.000.000-00"
                                        value={patient.cpf}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">E-mail</TableCell>
                                <TableCell className="flex justify-end font-medium lowercase">
                                    {patient.email}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Telefone</TableCell>
                                <TableCell className="flex justify-end font-medium tabular-nums">
                                    <MaskedInfo
                                        mask="(00) 00000-0000"
                                        value={patient.phoneNumber}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Item
                        variant="outline"
                        className="bg-sky-50/50 border-sky-200 dark:bg-sky-950/10 dark:border-sky-900"
                    >
                        <ItemMedia variant="icon" className="text-sky-600 dark:text-sky-500">
                            <ClockIcon className="h-5 w-5" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Tempo médio de atendimento</ItemTitle>
                            <ItemTitle className="text-xs font-normal text-muted-foreground">
                                Média baseada em atendimentos concluídos
                            </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-sky-700 dark:text-sky-400">
                                    {meta.averageDuration} min
                                </span>
                                <p className="text-xs text-muted-foreground">em sessão</p>
                            </div>
                        </ItemActions>
                    </Item>

                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tema da Sessão</TableHead>
                                    <TableHead className="text-right">Duração</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-right w-[80px]">Docs</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {patient.sessions.length > 0 ? (
                                    patient.sessions.map((session: any) => {
                                        const statusInfo = getStatusLabel(session.status)
                                        const s = session.status?.toUpperCase()
                                        const isFinished = s === "FINISHED" || s === "CONCLUÍDA" || s === "CONCLUIDO"
                                        const formattedDate = format(parseISO(session.date), "dd/MM/yyyy - HH:mm", { locale: ptBR })

                                        return (
                                            <TableRow key={session.id}>
                                                <TableCell className="whitespace-nowrap tabular-nums">{formattedDate}</TableCell>
                                                <TableCell className="max-w-[200px] truncate italic text-muted-foreground">
                                                    {session.theme || "Sem tema definido"}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right tabular-nums ${session.duration.includes('Aguardando')
                                                        ? 'text-muted-foreground italic text-[11px]'
                                                        : 'font-medium'
                                                        }`}
                                                >
                                                    {session.duration}
                                                </TableCell>
                                                <TableCell className={`text-right font-bold ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <TooltipProvider delayDuration={300}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="cursor-pointer h-8 w-8 text-primary"
                                                                    disabled={!isFinished}
                                                                    onClick={() => setSelectedSession(session)}
                                                                >
                                                                    <Eye size={16} />
                                                                    <span className="sr-only">Ver prontuário</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left">
                                                                <p>Ver prontuário do paciente</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Nenhuma sessão registrada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="font-medium text-muted-foreground">
                                        Total de sessões realizadas
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-foreground">
                                        {totalFinished}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>

                        <PaginationDetailsPatients
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={setPageIndex}
                        />
                    </div>
                </div>
            )}
        </DialogContent>
    )
}