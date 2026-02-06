"use client"

import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
    Activity, DollarSign, ShieldCheck, Lock, FileSearch,
    AlertCircle, History, Loader2, Clock,
    MoveLeftIcon
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { getPatientDetails } from "@/api/get-patient-details"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { PatientDetailsHeader } from "./components/patient-details-header"

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()
    const [pageIndex] = useState(0)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["patient-details", id, pageIndex],
        queryFn: () => getPatientDetails(id!, pageIndex),
        enabled: !!id,
    })

    const navigate = useNavigate()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (isError || !data?.patient) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-red-500 opacity-20" />
                <p className="text-muted-foreground text-sm font-medium">Dados não encontrados.</p>
            </div>
        )
    }

    const { patient, meta } = data

    return (
        <div className="flex flex-col gap-6 p-6 bg-background min-h-screen">

            <Link
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc hover-zinc-100 cursor-pointer" to={""}
            >
                <MoveLeftIcon className="size-4" />
                <h1 className="text-xs">Voltar para tabela</h1>
            </Link>

            {/* 🟢 CABEÇALHO COMPONENTIZADO */}
            <PatientDetailsHeader patient={patient} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                            <Activity className="h-3 w-3" /> Sessões Realizadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{meta.totalCount}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Média: {meta.averageDuration}min</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-3 w-3" /> Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">R$ --</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Sem pendências</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" /> Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-semibold text-amber-700">Dados Protegidos</p>
                            <p className="text-[10px] text-muted-foreground">Conformidade LGPD</p>
                        </div>
                        <Lock className="h-5 w-5 text-amber-500 opacity-30" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="clinical" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
                    <TabsTrigger value="clinical" className="rounded-lg px-6">Prontuário</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg px-6">Timeline</TabsTrigger>
                    <TabsTrigger value="docs" className="rounded-lg px-6">Arquivos</TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full" defaultValue="info">
                                <AccordionItem value="info">
                                    <AccordionTrigger className="text-sm font-bold">Informações Cadastrais</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">E-mail</span>
                                            <p className="text-sm font-medium">{patient.email || '—'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Celular</span>
                                            <p className="text-sm font-medium">{patient.phoneNumber || '—'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">CPF</span>
                                            <p className="text-sm font-medium font-mono">{patient.cpf || '—'}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6 space-y-4">
                    {patient.sessions.length > 0 ? (
                        <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                            {patient.sessions.map((session) => (
                                <div key={session.id} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-background shadow-sm" />
                                    <div className="flex flex-col gap-1 bg-muted/20 p-4 rounded-xl border border-transparent hover:border-muted transition-all">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(session.sessionDate || session.createdAt), "dd MMM yyyy '•' HH:mm", { locale: ptBR })}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] uppercase">{session.status}</Badge>
                                        </div>
                                        <p className="text-sm font-bold text-foreground mt-1">{session.theme || 'Sem tema'}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {session.content || 'Nenhuma evolução registrada.'}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary" className="text-[9px]">{session.duration} MIN</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-20 text-muted-foreground border border-dashed rounded-xl">
                            <History className="h-10 w-10 opacity-20 mb-2" />
                            <p className="text-sm">Nenhum atendimento registrado.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="docs" className="mt-6">
                    <div className="flex flex-col items-center py-20 text-muted-foreground border border-dashed rounded-xl">
                        <FileSearch className="h-10 w-10 opacity-20 mb-2" />
                        <p className="text-sm">Anexos e documentos.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}