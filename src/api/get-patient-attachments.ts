import { api } from "@/lib/axios"

export async function getPatientAttachments(patientId: string) {
    const response = await api.get(`/attachments/patient/${patientId}`)
    return response.data.attachments // Retorna [{ id, filename, url, ... }]
}