import { api } from "@/lib/axios"

export interface Attachment {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

export async function getPatientAttachments(patientId: string) {
  const response = await api.get<{ attachments: Attachment[] }>(`/attachments/patient/${patientId}`)
  return response.data.attachments
}