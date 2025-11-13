import { api } from "@/lib/axios"

export interface RegisterAppointmentRequest {
    patientId: string
    psychologistId: string 
    diagnosis: string
    notes?: string
    scheduledAt: Date
    startedAt?: Date
    endedAt?: Date
    status: string
}

export interface RegisterAppointmentResponse {
    message: string
    appointment: {
        id: string
        patientId: string
        psychologistId: string
        diagnosis: string
        notes?: string
        scheduledAt: string
        startedAt?: string
        endedAt?: string
        status: string
    }
}

export async function registerAppointment(
    data: RegisterAppointmentRequest
): Promise<RegisterAppointmentResponse> {
    
    const { psychologistId, ...rest } = data; 
    
    const payload = {
        ...rest, 
        scheduledAt: rest.scheduledAt.toISOString(),
        startedAt: rest.startedAt?.toISOString(),
        endedAt: rest.endedAt?.toISOString(),
    }

    const response = await api.post<RegisterAppointmentResponse>("/appointments", payload)
    
    return response.data
}