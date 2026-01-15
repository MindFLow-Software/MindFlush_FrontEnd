"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getMostVotedSuggestions } from "@/api/get-most-voted-suggestions"
import { toggleSuggestionLike } from "@/api/toggle-suggestion-like"
import { getProfile } from "@/api/get-profile"
import { SuggestionCard } from "@/components/suggestion-card"

export function MostVotedSuggestionsCard() {
    const queryClient = useQueryClient()

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["admin", "suggestions", "most-voted"],
        queryFn: getMostVotedSuggestions,
    })

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    })

    const { mutate: handleToggleLike } = useMutation({
        mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "suggestions", "most-voted"] })
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
    })

    return (
        <Card className="col-span-full lg:col-span-4 border-slate-200/80 bg-gradient-to-b from-slate-50 to-white shadow-md rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100 bg-white/50 space-y-1 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="size-4 text-[#27187E]" />
                        <CardTitle className="text-base font-bold text-slate-800">Sugestões em Alta</CardTitle>
                    </div>
                </div>
                <CardDescription className="text-xs font-medium text-slate-500">
                    Ideias mais apoiadas pela comunidade
                </CardDescription>
            </CardHeader>

            <CardContent className="p-3 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-200">
                {isLoading ? (
                    <div className="flex h-[300px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestions?.map((item) => (
                            <SuggestionCard
                                key={item.id}
                                item={item}
                                userId={profile?.id}
                                onLike={handleToggleLike}
                            />
                        ))}

                        {suggestions?.length === 0 && (
                            <p className="text-center py-10 text-slate-400 text-sm italic">
                                Nenhuma sugestão votada ainda.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}