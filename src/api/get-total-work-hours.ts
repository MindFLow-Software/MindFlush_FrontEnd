import { api } from "@/lib/axios"

export async function getTotalWorkHours(startDate?: Date, endDate?: Date) {
  const response = await api.get<{ totalMinutes: number }>('/sessions/total-work-hours', {
    params: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  })
  return response.data
}