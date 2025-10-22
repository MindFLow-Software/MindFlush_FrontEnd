import { api } from "@/lib/axios"
import type { Expertise, PsychologistRole } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

export interface RegisterPsychologistBody {
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

export async function registerPsychologist(data: RegisterPsychologistBody) {
  const formattedData = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth,
  }

  const response = await api.post("/psychologist", formattedData)
  return response.data
}
