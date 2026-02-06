import { api } from "@/lib/axios"

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl: string | null
    cpf: string
    email: string
    phoneNumber: string
    status: 'active' | 'inactive'
    sessions: Array<{
      id: string
      date: string
      sessionDate?: string | null
      createdAt: string
      theme: string
      duration: string
      status: string
      content: string | null
    }>
  }
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number
  }
}

export async function getPatientDetails(patientId: string, pageIndex: number): Promise<GetPatientDetailsResponse> {
  const response = await api.get<GetPatientDetailsResponse>(
    `/patients/${patientId}/details`,
    {
      params: { pageIndex },
    }
  )

  // Extrai os dados reais para evitar problemas de aninhamento (.props)
  const raw = (response.data.patient as any).props || response.data.patient

  return {
    ...response.data,
    patient: {
      ...raw, // Espalha os dados brutos (firstName, lastName, etc)
      id: raw.id || response.data.patient.id,
      // Normalização idêntica à da sua tabela (getPatients)
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null,
    },
  }
}