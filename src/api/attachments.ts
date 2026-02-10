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

async function uploadFile(file: File, patientId: string, type: 'DOCUMENT' | 'AVATAR') {
  const formData = new FormData()
  
  formData.append('patientId', patientId)
  formData.append('type', type)
  formData.append('file', file)

  const response = await api.post("/attachments", formData)
  
  return response.data
}

export async function uploadAttachment(file: File, patientId: string) {
  return uploadFile(file, patientId, 'DOCUMENT')
}

export async function uploadAvatar(file: File, patientId: string) {
  return uploadFile(file, patientId, 'AVATAR')
}