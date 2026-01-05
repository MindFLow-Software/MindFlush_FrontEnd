import { api } from "@/lib/axios"

export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null | undefined
  status?: string | null | undefined
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  name: string
  cpf: string
  email: string
  phoneNumber: string 
  gender: 'MASCULINE' | 'FEMININE' | 'OTHER'
  status: 'Ativo' | 'Inativo' 
  isActive: boolean 
  createdAt: string
  dateOfBirth: string 
  profileImageUrl: string | null
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
  filter,
  status,
}: GetPatientsFilters): Promise<GetPatientsResponse> {
  
  const response = await api.get("/patients", { 
    params: {
      pageIndex,
      perPage,
      filter: filter || undefined,
      status: status === 'all' ? null : status, 
    },
  })

  const normalizedPatients: Patient[] = response.data.patients.map((p: any) => {
    const raw = p.props || p 
    const checkIsActive = raw.isActive === true

    return {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      name: `${raw.firstName} ${raw.lastName}`.trim() || "Paciente sem nome",
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      gender: raw.gender || 'OTHER',
      status: checkIsActive ? 'Ativo' : 'Inativo',
      isActive: checkIsActive,
      createdAt: raw.createdAt,
      dateOfBirth: raw.dateOfBirth,
      profileImageUrl: raw.profileImageUrl || null
    }
  })

  return {
    patients: normalizedPatients,
    meta: response.data.meta
  }
}