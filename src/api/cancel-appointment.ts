import { api } from "@/lib/axios"

export async function cancelAppointment(appointmentId: string) {
  if (!appointmentId || appointmentId === "undefined") {
    throw new Error("ID do agendamento é obrigatório para o cancelamento.")
  }

  return await api.patch(`/appointments/${appointmentId}/cancel`)
}