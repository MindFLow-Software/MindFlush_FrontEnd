import { api } from "@/lib/axios"

export interface Suggestion {
  id: string
  title: string
  description: string
  category: "UI_UX" | "SCHEDULING" | "REPORTS" | "PRIVACY_LGPD" | "INTEGRATIONS" | "OTHERS"
  status: "PENDING" | "OPEN" | "UNDER_REVIEW" | "PLANNED" | "IMPLEMENTED" | "REJECTED"
  likes: string[]
  likesCount: number
  psychologistName: string
  createdAt: string
  attachments: string[]
}

interface GetSuggestionsParams {
  category?: string
  status?: string
  sortBy?: string
  search?: string 
}

export async function getSuggestions(params: GetSuggestionsParams) {
  const response = await api.get<{ suggestions: Suggestion[] }>("/suggestions", {
    params: {
      category: params.category,
      status: params.status,
      sortBy: params.sortBy,
      search: params.search,
    },
  })
  return response.data.suggestions
}