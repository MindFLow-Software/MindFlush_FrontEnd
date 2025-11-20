import { api } from "@/lib/axios"

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  cpf: string
  phoneNumber: string
  profileImageUrl?: string
  dateOfBirth: string
  gender: "MASCULINE" | "FEMININE" | "OTHER"
  status?: string
}

export interface GetPatientsRequest {
  pageIndex?: number | null
  perPage?: number | null
  name?: string | null
  cpf?: string | null
  status?: string | null // 1. Adicionado Status
}

export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getPatients({
  pageIndex,
  perPage,
  name,
  cpf,
  status, // Recebe o status
}: GetPatientsRequest): Promise<GetPatientsResponse> {
  
  const response = await api.get<GetPatientsResponse>('/patients', {
    params: {
      // 2. Correção de Índice (IMPORTANTE): 
      // Se seu backend espera 'page' (1, 2, 3), use a linha abaixo:
      // page: (pageIndex ?? 0) + 1, 
      
      // Se seu backend foi feito para aceitar 'pageIndex' (0, 1, 2), mantenha assim:
      pageIndex: pageIndex ?? 0,

      perPage: perPage ?? 10, // 3. Padronizado para 10 (igual ao frontend)
      name,
      cpf,
      status: status === "all" ? null : status, // Envia status (ou null se for 'all')
    },
  })

  return response.data
}