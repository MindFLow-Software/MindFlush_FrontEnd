import { api } from "@/lib/axios"

export async function handleFileDownload(fileKey: string, filename: string) {
  try {
    // 🟢 OBRIGATÓRIO: responseType 'blob' para arquivos binários
    const response = await api.get(`/attachments/${fileKey}`, {
      responseType: 'blob', 
    })

    // Cria o arquivo na memória do navegador
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/octet-stream' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.setAttribute('download', filename) // Garante o nome original com acento
    document.body.appendChild(link)
    link.click()

    // Limpeza necessária
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Erro ao processar download:", error)
  }
}