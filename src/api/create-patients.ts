import { api } from "@/lib/axios"
import { format } from "date-fns"
import type { Expertise, PatientRole } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

export interface RegisterPatientsBody {
    firstName: string
    lastName: string
    email?: string
    password?: string
    phoneNumber: string
    profileImageUrl?: string
    dateOfBirth: Date | string
    cpf: string
    role: PatientRole
    gender: Gender
    expertise: Expertise
    isActive?: boolean
    attachmentIds?: string[]
}

export async function registerPatients(data: RegisterPatientsBody) {
    
    const rawCpf = data.cpf.replace(/\D/g, '') 
    const rawPhoneNumber = data.phoneNumber.replace(/\D/g, '')

    const formattedData = {
        ...data,
        cpf: rawCpf, 
        phoneNumber: rawPhoneNumber, 
        dateOfBirth:
            data.dateOfBirth instanceof Date
                ? format(data.dateOfBirth, "yyyy-MM-dd")
                : data.dateOfBirth,
    }

    const response = await api.post("/patient", formattedData)
    return response.data
}