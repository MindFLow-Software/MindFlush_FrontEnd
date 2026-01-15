"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
    LayoutGrid
} from "lucide-react"

import { useHeaderStore } from "@/hooks/use-header-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MostVotedSuggestionsCard } from "./components/most-voted-suggestions-card"
import { PendingSuggestionsModeration } from "./components/pending-suggestions-moderation"
import { SuggestionRanking } from "./components/ranking-table"

export function AdminSuggestionsPage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Painel de Sugestões')
    }, [setTitle])


    return (
        <>
            <Helmet title="Sugestões e Sugestões" />

            <div className="flex flex-col gap-8 mt-6">
                <div>
                    <Card className="bg-blue-600 text-white border-none shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <LayoutGrid className="size-4" />
                                Priorização
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs leading-relaxed opacity-90">
                                As sugestões mais votadas refletem as necessidades reais dos psicólogos.
                                Considere movê-las para "Em Análise" para notificar os autores.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <PendingSuggestionsModeration />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className=" space-y-6">
                        <MostVotedSuggestionsCard />
                    </div>
                    <div className=" space-y-6">
                        <SuggestionRanking />
                    </div>
                </div>

            </div>
        </>
    )
}