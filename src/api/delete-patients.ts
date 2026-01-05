import { api } from "@/lib/axios"

/**
 * @param patientId
 * @param isActive
 */

export async function deletePatients(patientId: string, isActive: boolean) {
    const response = await api.patch(`/patients/${patientId}/status`, { 
        isActive 
    }) 
    
    return response.data
}