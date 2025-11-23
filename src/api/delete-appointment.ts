import { api } from "@/lib/axios"

export async function deleteAppointment(appointmentId: string) {
    await api.delete(`/appointments/${appointmentId}`)
}