import { api } from "@/lib/axios"

export async function getPatients() {
    const response = await api.get("/patients")
    return response.data
}
