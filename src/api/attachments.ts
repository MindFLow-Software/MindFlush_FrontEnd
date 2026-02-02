import { api } from "@/lib/axios"

export interface Attachment {
  id: string
  filename: string
  fileUrl: string
  contentType: string
  SizeInBytes: number
  uploadedAt: string
  patient: {
    firstName: string
    lastName: string
  } | null
}

interface GetAttachmentsResponse {
  attachments: Attachment[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
    totalStorageSize: number
  }
}

export async function getAllAttachments(pageIndex: number, search?: string): Promise<GetAttachmentsResponse> {
  const response = await api.get<GetAttachmentsResponse>("/attachments", {
    params: { 
      page: pageIndex,
      filter: search
    }
  })
  return response.data
}

export async function getPatientAttachments(patientId: string) {
  const response = await api.get<{ attachments: Attachment[] }>(`/attachments/patient/${patientId}`)
  return response.data.attachments
}

export async function deleteAttachment(id: string) {
  await api.delete(`/attachments/${id}`)
}

export async function uploadAttachment(file: File, patientId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientId', patientId)

  const response = await api.post("/attachments", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  
  return response.data
}