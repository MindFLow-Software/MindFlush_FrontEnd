'use client';

import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import {
    Activity, DollarSign, ShieldCheck, Lock, FileSearch,
    AlertCircle, Loader2, Plus, Download, MoreVertical, Printer, Trash2, MoveLeft
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPatientDetails } from "@/api/get-patient-details"
import { PatientDetailsHeader } from "./components/patient-details-header"
import { useHeaderStore } from "@/hooks/use-header-store"
import { MetricCard } from "./components/metric-card"
import { PatientInfo } from "./components/patient-Info"
import { PatientSessionsTimeline } from "./components/patient-sessions-timeline"

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { setTitle, setSubtitle } = useHeaderStore()

    const [pageIndex, setPageIndex] = useState(0)

    const [currentTab, setCurrentTab] = useState("clinical")

    const { data, isLoading, isError } = useQuery({
        queryKey: ["patient-details", id, pageIndex],
        queryFn: () => getPatientDetails(id!, pageIndex),
        enabled: !!id,
    })

    useEffect(() => {
        setTitle("Cadastro de Pacientes")

        if (data?.patient) {
            const name = `${data.patient.firstName} ${data.patient.lastName}`
            setSubtitle(name)
        }

        return () => setSubtitle(undefined)
    }, [data, setTitle, setSubtitle])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (isError || !data?.patient) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive/50" />
                <div>
                    <h2 className="text-lg font-semibold">Paciente não encontrado</h2>
                    <p className="text-muted-foreground text-sm">Verifique o ID ou tente novamente mais tarde.</p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>Voltar para tabela</Button>
            </div>
        )
    }

    const { patient, meta } = data
    const patientFullName = `${patient.firstName} ${patient.lastName}`

    return (
        <div className="flex flex-col gap-6">
            {/* Top bar: Breadcrumb + Actions */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                    >
                        <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-medium uppercase tracking-wider">Voltar para listagem</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-muted-foreground bg-transparent cursor-pointer"
                            >
                                <Download className="size-3.5" />
                                <span className="hidden md:inline">Exportar</span>
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                            <Plus className="size-3.5" />
                            <span>Nova Sessão</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="size-8 p-0 cursor-pointer">
                                    <MoreVertical className="size-4" />
                                    <span className="sr-only">Mais opções</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="gap-2 sm:hidden cursor-pointer">
                                    <Download className="size-4" />
                                    Exportar PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Printer className="size-4" />
                                    Imprimir prontuário
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                                    <Trash2 className="size-4" />
                                    Arquivar paciente
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Separator />
            </div>

            <PatientDetailsHeader patient={patient} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    title="Sessões Totais"
                    value={meta.totalCount}
                    subLabel="Duração média"
                    subValue={meta.averageDuration}
                    icon={Activity}
                />

                <Card className="shadow-sm border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] uppercase text-muted-foreground flex items-center gap-2 font-semibold tracking-wide">
                            <div className="flex items-center justify-center size-5 rounded bg-emerald-100 text-emerald-600">
                                <DollarSign className="size-3" />
                            </div>
                            Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-foreground tabular-nums">R$ --</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Regularizado</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border sm:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] uppercase text-muted-foreground flex items-center gap-2 font-semibold tracking-wide">
                            <div className="flex items-center justify-center size-5 rounded bg-amber-100 text-amber-600">
                                <ShieldCheck className="size-3" />
                            </div>
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Dados Criptografados</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Conformidade LGPD ativa</p>
                        </div>
                        <Lock className="size-5 text-amber-400/40" />
                    </CardContent>
                </Card>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="bg-muted/60 p-1 rounded-lg w-full sm:w-auto">
                    <TabsTrigger
                        value="clinical"
                        className="cursor-pointer rounded-md px-6 text-sm data-[state=active]:shadow-sm"
                    >
                        Prontuário
                    </TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        className="cursor-pointer rounded-md px-6 text-sm data-[state=active]:shadow-sm"
                    >
                        Histórico
                    </TabsTrigger>
                    <TabsTrigger
                        value="docs"
                        className="cursor-pointer rounded-md px-6 text-sm data-[state=active]:shadow-sm"
                    >
                        Arquivos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="mt-6">
                    <PatientInfo patient={{ ...patient, totalAppointments: meta.totalCount }} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <PatientSessionsTimeline
                        sessions={patient.sessions}
                        meta={meta}
                        pageIndex={pageIndex}
                        onPageChange={setPageIndex}
                        patientName={patientFullName}
                    />
                </TabsContent>

                <TabsContent value="docs" className="mt-6">
                    <div className="flex flex-col items-center py-20 text-center border border-dashed rounded-xl bg-muted/5">
                        <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-4">
                            <FileSearch className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Repositório de Documentos</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Upload de exames, laudos e outros documentos em breve.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}