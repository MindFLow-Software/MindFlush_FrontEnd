import { api } from "@/lib/axios"
import type { Gender } from "@/types/enum-gender"

// Mantendo sua definição de Role
type Role = "PATIENT" | "ADMIN" | "DOCTOR" 

export interface UpdatePatientData {
    id: string
    firstName?: string
    lastName?: string
    socialName?: string
    email?: string
    password?: string
    phoneNumber?: string
    profileImageUrl?: string
    dateOfBirth?: Date | string
    cpf?: string
    gender?: Gender
    role?: Role
    isActive?: boolean 
    attachmentIds?: string[] 
}

export async function updatePatient({ id, ...data }: UpdatePatientData) {
    const formattedData = {
        ...data,
        dateOfBirth:
            data.dateOfBirth instanceof Date
                ? data.dateOfBirth.toISOString().split('T')[0]
                : data.dateOfBirth,
        cpf: data.cpf?.replace(/\D/g, ''),
        phoneNumber: data.phoneNumber?.replace(/\D/g, ''),
    }

    const payload = Object.fromEntries(
        Object.entries(formattedData).filter(
            ([_, value]) => value !== undefined && value !== null
        )
    )

    const response = await api.put(`/patients/${id}`, payload)
    return response.data
}