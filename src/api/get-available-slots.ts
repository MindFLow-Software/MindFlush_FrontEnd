import { api } from '@/lib/axios'

interface GetAvailableSlotsRequest {
  psychologistId: string
  date: Date
}

interface GetAvailableSlotsResponse {
  slots: string[]
}

export async function getAvailableSlots({ psychologistId, date }: GetAvailableSlotsRequest) {
  const response = await api.get<GetAvailableSlotsResponse>('/appointments/available-slots', {
    params: {
      psychologistId,
      date: date.toISOString(),
    },
  })

  return response.data
}