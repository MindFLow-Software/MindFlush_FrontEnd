import { api } from '@/lib/axios'

// 1. Definição do Enum Status (Necessário para a tipagem da entidade)
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
} as const

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

// 2. CORRIGIDO: Inclui as relações aninhadas e status correto (Resolve TS2339 e TS2305)
export interface Appointment {
  patientName: string
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string | null
  scheduledAt: string
  startedAt?: string | null
  endedAt?: string | null
  status: AppointmentStatus

  // RELAÇÕES ANINHADAS (Resolve erro 'patient' e 'psychologistId' no frontend)
  patient: {
    id(id: any): [any, any]
    firstName: string
    lastName: string
  }
  psychologist: {
    firstName: string
    lastName: string
  }
}

export interface GetAppointmentsRequest {
  pageIndex?: number
  perPage?: number
  status?: string | null
  orderBy?: 'asc' | 'desc'
}

// 3. CORRIGIDO: Tipagem da Resposta
export interface GetAppointmentsResponse {
  appointments: Appointment[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

// 4. CORRIGIDO: Lida com a tipagem de ordenação (Resolve TS2322)
export async function getAppointments(
  params: GetAppointmentsRequest,
): Promise<GetAppointmentsResponse> {
  
  const finalOrderBy = (params.orderBy ?? 'desc') as 'asc' | 'desc'

  const response = await api.get<GetAppointmentsResponse>('/appointments', {
    params: {
        pageIndex: params.pageIndex ?? 0, 
        perPage: params.perPage ?? 10, 
        orderBy: finalOrderBy, 
        ...(params.status && { status: params.status }), 
    },
  })

  return response.data
}