import { api } from "@/lib/axios"

export interface PatientsByAgeResponse {
    ageRange: string
    patients: number
}

export async function getPatientsByAge(): Promise<PatientsByAgeResponse[]> {
    const response = await api.get<PatientsByAgeResponse[]>("/patients/stats/age")
    return response.data
}
