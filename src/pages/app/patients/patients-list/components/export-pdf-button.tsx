"use client"

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SessionPDFTemplate } from '@/utils/session-pdf-template'

interface ExportButtonProps {
    appointment: any // Tipagem do seu Appointment
    psychologist: { name: string; crp: string }
}

export function ExportPDFButton({ appointment, psychologist }: ExportButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        try {
            setIsGenerating(true)

            // Monta o layout dinamicamente com os dados do banco
            const blob = await pdf(
                <SessionPDFTemplate
                    psychologist={psychologist}
                    patientName={appointment.patientName}
                    date={new Date(appointment.scheduledAt).toLocaleDateString('pt-BR')}
                    content={appointment.content || "Nenhuma evolução registrada."}
                    diagnosis={appointment.diagnosis}
                />
            ).toBlob()

            // Gera o link de download no navegador
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Sessao-${appointment.patientName}-${appointment.id.substring(0, 5)}.pdf`
            link.click()

            URL.revokeObjectURL(url)
            toast.success("PDF gerado com sucesso!")
        } catch (error) {
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            onClick={handleDownload}
            disabled={isGenerating || !appointment.content}
            variant="outline"
            className="gap-2"
        >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Exportar Evolução
        </Button>
    )
}