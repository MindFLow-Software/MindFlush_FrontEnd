"use client"

import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ShieldCheck, Info } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaginationDocsPatients } from "@/components/pagination-docs-patients"

import { useHeaderStore } from "@/hooks/use-header-store"
import { getAllAttachments, deleteAttachment } from "@/api/attachments"
import { AttachmentsTableFilters } from "./patients-docs/attachments-table-filters"
import { AttachmentsTable } from "./patients-docs/attachments-table"

export function PatientDocuments() {
    const { setTitle } = useHeaderStore()
    const queryClient = useQueryClient()

    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        setTitle('Gestão de Documentos')
    }, [setTitle])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPageIndex(0)
        }, 500)

        return () => clearTimeout(handler)
    }, [search])

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ["all-attachments", pageIndex, debouncedSearch],
        queryFn: () => getAllAttachments(pageIndex, debouncedSearch),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })

    const { mutateAsync: deleteFn } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-attachments"] })
            toast.success("Registro removido do sistema.")
        }
    })

    const formatBytes = (bytes: number | undefined | null) => {
        const value = Number(bytes)
        if (isNaN(value) || value <= 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(value) / Math.log(k))
        const unitIndex = Math.min(i, sizes.length - 1)
        return `${parseFloat((value / Math.pow(k, unitIndex)).toFixed(2))} ${sizes[unitIndex]}`
    }

    const attachments = useMemo(() => result?.attachments ?? [], [result])

    const meta = useMemo(() => result?.meta ?? {
        pageIndex,
        perPage: 10,
        totalCount: 0,
        totalStorageSize: 0
    }, [result, pageIndex])

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p className="text-destructive font-medium">Erro ao carregar documentos 😕</p>
                <button onClick={() => window.location.reload()} className="text-sm underline text-muted-foreground hover:text-foreground">
                    Tentar novamente
                </button>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Documentos - MindFlush" />

            <div className="flex flex-col gap-6 mt-6">
                <section className="grid grid-cols-1 gap-6">
                    <Card className="bg-card border-border flex flex-col justify-between shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.1em] flex items-center gap-2">
                                <Info className="size-3" />Total de arquivos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {formatBytes(meta.totalStorageSize)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Soma de todos os documentos</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                    <ShieldCheck className="size-3" /> Integridade Verificada
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="space-y-4">
                    <AttachmentsTableFilters
                        search={search}
                        onSearchChange={(val) => setSearch(val)}
                        onClearFilters={() => { setSearch(""); setPageIndex(0); }}
                    />

                    <AttachmentsTable
                        attachments={attachments}
                        isLoading={isLoading}
                        onDelete={deleteFn}
                    />

                    {meta.totalCount > 0 && (
                        <PaginationDocsPatients
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={setPageIndex}
                        />
                    )}
                </div>
            </div>
        </>
    )
}