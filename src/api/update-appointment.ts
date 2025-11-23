import { api } from "@/lib/axios"

export interface UpdateAppointmentRequest {
  id: string
  patientId: string
  diagnosis: string
  notes?: string
  scheduledAt: Date
  status: string // Você pode tipar como 'AppointmentStatus' se tiver esse enum compartilhado
}

export async function updateAppointment({
  id,
  patientId,
  diagnosis,
  notes,
  scheduledAt,
  status,
}: UpdateAppointmentRequest) {
  await api.put(`/appointments/${id}`, {
    patientId,
    diagnosis,
    notes,
    scheduledAt,
    status,
  })
}