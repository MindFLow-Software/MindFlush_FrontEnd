import { api } from "@/lib/axios"
import type { Expertise, PatientRole } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

export interface RegisterPatientsBody {
    firstName: string
    lastName: string
    email?: string
    password: string
    phoneNumber: string
    profileImageUrl?: string
    dateOfBirth: Date | string
    cpf: string
    role: PatientRole
    gender: Gender
    expertise: Expertise
    isActive?: boolean
}

export async function registerPatients(data: RegisterPatientsBody) {
    const formattedData = {
        ...data,
        dateOfBirth:
            data.dateOfBirth instanceof Date
                ? data.dateOfBirth.toISOString()
                : data.dateOfBirth,
    }

    const response = await api.post("/patient", formattedData)
    return response.data
}
