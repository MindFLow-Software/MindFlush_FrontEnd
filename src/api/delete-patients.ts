import { api } from "@/lib/axios"

/**
 * Deleta (Soft Delete) um paciente pelo ID.
 * O ID do psicólogo é obtido automaticamente pelo token JWT.
 * @param patientId - ID do paciente a ser excluído.
 */
export async function deletePatients(patientId: string) {
    const response = await api.delete(`/patients/${patientId}`) 
    return response.data
}