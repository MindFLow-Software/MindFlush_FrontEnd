import { api } from "@/lib/axios"

export interface RescheduleAppointmentRequest {
  appointmentId: string
  newDate: Date
}

export async function rescheduleAppointment({ 
  appointmentId, 
  newDate 
}: RescheduleAppointmentRequest) {
  await api.put(`/appointments/${appointmentId}/reschedule`, {
    newDate: newDate.toISOString(),
  })
}