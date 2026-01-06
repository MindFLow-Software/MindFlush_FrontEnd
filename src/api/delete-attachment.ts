import { api } from "@/lib/axios"

export async function deleteAttachment(id: string) {
    await api.delete(`/attachments/${id}`)
}