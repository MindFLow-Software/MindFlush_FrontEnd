"use client"

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SessionPDFTemplate } from '@/utils/session-pdf-template'

interface ExportButtonProps {
    session: any
    patientName: string
    psychologist: { name: string; crp: string }
}

export function ExportPDFButton({ session, patientName, psychologist }: ExportButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        if (!session) return

        try {
            setIsGenerating(true)

            const dateFormatted = format(
                new Date(session.sessionDate ?? session.createdAt),
                "dd/MM/yyyy 'às' HH:mm",
                { locale: ptBR }
            )

            const blob = await pdf(
                <SessionPDFTemplate
                    psychologist={psychologist}
                    patientName={patientName}
                    date={dateFormatted}
                    content={session.content || "Nenhuma nota registrada."}
                    diagnosis={session.theme || ""}
                />
            ).toBlob()

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Evolucao-${patientName.replace(/\s/g, '_')}-${session.id.substring(0, 5)}.pdf`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            URL.revokeObjectURL(url)
            toast.success("PDF baixado com sucesso!")
        } catch (error) {
            console.error("Erro na geração do PDF:", error)
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            onClick={handleDownload}
            disabled={isGenerating || !session?.content}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {isGenerating ? "Gerando..." : "Baixar PDF"}
        </Button>
    )
}