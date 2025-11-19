import { useMemo, useState, useEffect } from 'react'
import { Goal } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Importe a imagem do cérebro (assumindo que está em /public)
// NOTE: Se estiver usando Next.js, você pode precisar de um import específico.

interface MonthSessionData {
    total: number
}

// Simulação da API (substitua pela sua)
const fetchMonthSessionsTotal = async (): Promise<MonthSessionData> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1200))
        return { total: 58 }
    } catch (error) {
        console.error('Erro ao buscar total de sessões do mês:', error)
        throw error
    }
}

export function MonthPatientsAmountCard() {
    const [state, setState] = useState({
        total: null as number | null,
        isLoading: true,
        isError: false
    })

    useEffect(() => {
        fetchMonthSessionsTotal()
            .then(data =>
                setState({ total: data.total, isLoading: false, isError: false })
            )
            .catch(() =>
                setState(prev => ({ ...prev, isLoading: false, isError: true }))
            )
    }, [])

    const { displayValue, diffSign, formattedDiff, diffColorClass } = useMemo(() => {
        if (state.total === null) {
            return {
                displayValue: '—',
                diffSign: '',
                formattedDiff: 0,
                // Mantendo a cor do diff como emerald, se o objetivo for verde para positivo
                diffColorClass: 'text-emerald-500 dark:text-emerald-400'
            }
        }

        const displayValue = state.total
        const diff = 0.12 // mock de diferença percentual
        const formattedDiff = diff * 100
        const diffSign = formattedDiff >= 0 ? '+' : ''
        const diffColorClass =
            formattedDiff >= 0
                ? 'text-emerald-500 dark:text-emerald-400' // Verde para positivo
                : 'text-red-500 dark:text-red-400' // Vermelho para negativo

        return { displayValue, diffSign, formattedDiff, diffColorClass }
    }, [state.total])

    return (
        <Card
            className={cn(
                // Corrigido: usando rounded-2xl (padrão) e bg-gradient-to-r
                "relative overflow-hidden rounded-2xl border border-border/60 border-b-[3px] border-b-purple-700 dark:border-b-purple-500",
                "shadow-md shadow-black/20 dark:shadow-black/8 bg-card transition-all p-4"
            )}
        >
            {/* 1. GRADIENTE ABSOLUTO (ROXO) */}
            <div
                className={cn(
                    "absolute -top-14 -right-14 w-40 h-40 rounded-full",
                    "bg-linear-to-r from-purple-300/50 to-purple-700/30 dark:from-purple-400/70 dark:to-purple-900",
                    "blur-3xl opacity-60 pointer-events-none"
                )}
            />

            {/* 2. IMAGEM DO CÉREBRO (ADICIONADA) */}
            <img
                src={'/goal.svg'}
                alt="Ícone de Cérebro/Ideia"
                className={cn(
                    "absolute bottom-0 right-0", // Posição
                    "w-3xl h-auto max-w-[150px]", // Tamanho
                    "opacity-70", // <-- Novo: Valor único para Light e Dark
                    "pointer-events-none", // Garante que não interfira no clique
                    "translate-x-1/4 translate-y-1/4" // Move a imagem para fora do Card ligeiramente
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="rounded-full bg-purple-100/80 dark:bg-purple-950/40 p-2 w-fit">
                    <Goal className="size-5 text-purple-600 dark:text-purple-400" />
                </div>

                {state.isLoading ? (
                    <div className="space-y-2">
                        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                ) : state.isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
                        <span className="text-xs text-muted-foreground">Tente novamente</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight leading-none">
                            {displayValue.toLocaleString("pt-BR")}
                        </span>

                        <p className="text-[13px] text-muted-foreground font-medium leading-none">
                            Sessões realizadas no mês
                        </p>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className={cn("font-semibold", diffColorClass)}>
                                {diffSign}
                                {formattedDiff.toFixed(1)}%
                            </span>{" "}
                            em relação ao mês anterior
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}