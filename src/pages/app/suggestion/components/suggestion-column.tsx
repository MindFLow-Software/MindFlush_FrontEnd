"use client"

import type React from "react"
import { useMemo } from "react"
import { ThumbsUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Suggestion } from "@/api/get-suggestions"
import { toggleSuggestionLike } from "@/api/toggle-suggestion-like"
import { getProfile } from "@/api/get-profile"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
            <header
                className={cn(
                    "p-4 flex items-center gap-2.5 font-semibold text-sm text-slate-700 shrink-0 border-b border-slate-100",
                    color,
                )}
            >
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
                    <p className="text-center p-6 text-slate-400 text-sm">Nenhuma sugestão</p>
                ) : (
                    sortedSuggestions.map((item) => (
                        <SuggestionItem key={item.id} item={item} userId={profile?.id} onLike={handleToggleLike} />
                    ))
                )}
            </div>
        </div>
    )
}

function SuggestionItem({
    item,
    userId,
    onLike,
}: {
    item: Suggestion
    userId?: string
    onLike: (id: string) => void
}) {
    const isLiked = userId ? item.likes?.includes(userId) : false

    return (
        <Dialog>
            <DialogTrigger asChild>
                <article
                    className={cn(
                        "border rounded-xl p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden",
                        isLiked
                            ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 shadow-sm shadow-emerald-200/50"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm",
                    )}
                >
                    <div
                        className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                            isLiked ? "from-emerald-100/20 to-transparent" : "from-slate-100/30 to-transparent",
                        )}
                    />

                    <div className="relative space-y-3">
                        <div className="space-y-2 pr-2">
                            <h3
                                className={cn(
                                    "font-semibold leading-snug line-clamp-2 text-sm transition-colors",
                                    isLiked ? "text-emerald-900" : "text-slate-800 group-hover:text-[#27187E]",
                                )}
                            >
                                {item.title}
                            </h3>
                            <p
                                className={cn(
                                    "line-clamp-2 leading-relaxed text-xs",
                                    isLiked ? "text-emerald-700/90" : "text-slate-600",
                                )}
                            >
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200/60">
                            <button
                                className={cn(
                                    "cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold",
                                    "active:scale-95 hover:scale-105 relative z-10 min-w-[56px] tabular-nums",
                                    isLiked
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/60 hover:bg-emerald-600"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200",
                                )}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onLike(item.id)
                                }}
                                type="button"
                            >
                                <ThumbsUp className={cn("size-3.5 transition-all duration-300", isLiked)} />
                                <span>{item.likesCount}</span>
                            </button>
                        </div>
                    </div>
                </article>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] border-[#27187E]/10 gap-6">
                <DialogHeader>
                    <div className="mb-2">
                        <span className="text-[10px] bg-[#27187E]/10 text-[#27187E] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {item.category}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">{item.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>

                    <footer className="flex flex-wrap gap-6 pt-2 border-t border-dashed">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <Calendar className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-400">Data</span>
                                <span className="font-medium text-slate-700">
                                    {format(new Date(item.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}