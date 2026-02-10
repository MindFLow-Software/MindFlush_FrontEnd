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
    // 🟢 Adicione estes campos na Interface
    dateOfBirth: string | null 
    gender: 'MASCULINE' | 'FEMININE' | 'OTHER' | null
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
  const response = await api.get<any>(`/patients/${patientId}/details`, {
    params: { pageIndex },
  })

  // Log de Debug: Abra o console do navegador e veja se o campo existe aqui
  console.log("Dados brutos do paciente:", response.data.patient)

  const p = response.data.patient
  const raw = p.props || p 

  return {
    ...response.data,
    patient: {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      status: raw.isActive === false ? 'inactive' : 'active',
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null,
      
      dateOfBirth: raw.dateOfBirth || raw.date_of_birth || null, 
      gender: raw.gender || null,
      
      sessions: raw.sessions || p.sessions || []
    }
  }
}