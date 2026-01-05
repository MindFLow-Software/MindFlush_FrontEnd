import { api } from "@/lib/axios"

export async function togglePatientStatus(id: string, isActive: boolean) {
  await api.patch(`/patients/${id}/status`, { isActive })
}