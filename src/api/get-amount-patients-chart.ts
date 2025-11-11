import { api } from "@/lib/axios"

export type NewPatientsResponse = {
  date: string
  newPatients: number
}[]

export type GetAmountPatientsChartParams = {
  startDate: Date
  endDate: Date
}

export async function getAmountPatientsChart({
  startDate,
  endDate,
}: GetAmountPatientsChartParams): Promise<NewPatientsResponse> {
  
  const { data } = await api.get<NewPatientsResponse>("/patients/stats/new", {
    params: {
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString(),   
    },
  })
  
  return data
}