"use client"

import type React from "react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/get-suggestions"
import { toggleSuggestionLike } from "@/api/toggle-suggestion-like"
import { getProfile } from "@/api/get-profile"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SuggestionCard } from "@/components/suggestion-card"

interface SuggestionColumnProps {
    title: string
    icon: React.ReactNode
    color: string
    dotColor: string
    suggestions?: Suggestion[]
    isLoading: boolean
}

export function SuggestionColumn({ title, icon, color, dotColor, suggestions = [], isLoading }: SuggestionColumnProps) {
    const queryClient = useQueryClient()

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    })

    const sortedSuggestions = useMemo(() => {
        return [...suggestions].sort((a, b) => b.likesCount - a.likesCount)
    }, [suggestions])

    const { mutate: handleToggleLike } = useMutation({
        mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
        onMutate: async (suggestionId) => {
            await queryClient.cancelQueries({ queryKey: ["suggestions"] })
            const previousQueries = queryClient.getQueriesData<Suggestion[]>({ queryKey: ["suggestions"] })

            queryClient.setQueriesData<Suggestion[]>({ queryKey: ["suggestions"] }, (old) => {
                return old?.map((suggestion) => {
                    if (suggestion.id === suggestionId) {
                        const userId = profile?.id ?? ""
                        const isLiked = suggestion.likes.includes(userId)
                        const newLikes = isLiked
                            ? suggestion.likes.filter((id) => id !== userId)
                            : [...suggestion.likes, userId]

                        return {
                            ...suggestion,
                            likes: newLikes,
                            likesCount: newLikes.length,
                        }
                    }
                    return suggestion
                })
            })

            return { previousQueries }
        },
        onError: (_err, _id, context) => {
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
    })

    return (
        <div className="flex flex-col w-full bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200/80 h-full overflow-hidden shadow-md">
            <header className={cn("p-4 flex items-center gap-2.5 font-semibold text-sm text-slate-700 shrink-0 border-b border-slate-100", color)}>
                <div className={cn("size-2 rounded-full animate-pulse", dotColor)} />
                <span className="text-base">{icon}</span>
                <span className="truncate flex-1">{title}</span>
                <span className="text-xs bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full font-bold text-slate-600">
                    {suggestions.length}
                </span>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : sortedSuggestions.length === 0 ? (
                    <p className="text-center p-6 text-slate-400 text-sm italic">Nenhuma sugestão por aqui ainda...</p>
                ) : (
                    sortedSuggestions.map((item) => (
                        <SuggestionCard
                            key={item.id}
                            item={item}
                            userId={profile?.id}
                            onLike={handleToggleLike}
                        />
                    ))
                )}
            </div>
        </div>
    )
}