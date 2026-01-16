import { api } from "@/lib/axios"

export interface PendingPsychologist {
  id: string
  firstName: string
  lastName: string
  email: string
  crp: string | null
  cpf: string
  phoneNumber: string
  expertise: string | null
  dateOfBirth: string
  createdAt: string
  profileImageUrl?: string
}

export interface GetApprovalsResponse {
  psychologists: PendingPsychologist[]
}

export async function getPendingApprovals() {
  const response = await api.get<GetApprovalsResponse>('/admin/approvals')
  return response.data
}

export async function approvePsychologist(psychologistId: string) {
  await api.patch(`/admin/approvals/${psychologistId}/approve`)
}

export async function rejectPsychologist(psychologistId: string) {
  await api.patch(`/admin/approvals/${psychologistId}/reject`)
}