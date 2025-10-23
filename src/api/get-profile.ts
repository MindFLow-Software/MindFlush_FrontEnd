import { api } from "@/lib/axios"
import type { Gender } from "@/types/enum-gender"
import type { Expertise, PsychologistRole } from "@/types/expertise"

interface GetProfileResponse {
    firstName: string
    lastName: string
    phoneNumber: string
    cpf: string
    dateOfBirth: Date | string
    role: PsychologistRole
    gender: Gender
    expertise: Expertise
    isActive?: boolean
    email?: string
    password?: string
    profileImageUrl?: string
    crp?: string
}

export async function GetProfile() {
    const response = await api.get<GetProfileResponse>('/me')

    return response.data
}