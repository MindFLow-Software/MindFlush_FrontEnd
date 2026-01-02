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
  createdAt: string
  dateOfBirth: string 
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
  const response = await api.get<any>("/patients", { 
    params: {
      pageIndex,
      perPage,
      filter,
      status,
    },
  })

  const normalizedPatients: Patient[] = response.data.patients.map((p: any) => {
    const raw = p.props || p 
    
    const fName = raw.firstName || ""
    const lName = raw.lastName || ""

    return {
      id: p.id || raw.id || p._id || Math.random().toString(36).substr(2, 9), 
      
      firstName: fName,
      lastName: lName,
      
      name: (fName || lName) 
        ? `${fName} ${lName}`.trim() 
        : (raw.name || raw.patientName || "Paciente sem nome"),
      
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      gender: raw.gender || 'OTHER',
      status: raw.status || 'Ativo',
      createdAt: raw.createdAt || new Date().toISOString(),
      dateOfBirth: raw.dateOfBirth || ""
    }
  })

  return {
    patients: normalizedPatients,
    meta: response.data.meta
  }
}