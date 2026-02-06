"use client"

import { useState, useRef, useEffect } from "react"
import { User, Camera, Loader2 } from "lucide-react"
import { api } from "@/lib/axios"

interface PatientAvatarUploadProps {
    onFileSelect: (file: File | null) => void
    defaultValue?: string | null
}

export function PatientAvatarUpload({ onFileSelect, defaultValue }: PatientAvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function fetchCurrentImage() {
            if (!defaultValue) {
                setPreview(null)
                return
            }

            // Se for base64 (preview local), apenas exibe
            if (defaultValue.startsWith('data:')) {
                setPreview(defaultValue)
                return
            }

            try {
                setIsLoading(true)

                // 🟢 CORREÇÃO: Se for apenas um ID (UUID), adicionamos o prefixo da rota de attachments
                // Se o defaultValue já começar com '/', usamos como está.
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(defaultValue)
                const path = isUuid ? `/attachments/${defaultValue}` : defaultValue

                const response = await api.get(path, {
                    responseType: 'blob',
                })

                const objectUrl = URL.createObjectURL(response.data)
                setPreview(objectUrl)

                return () => URL.revokeObjectURL(objectUrl)
            } catch (error) {
                // Se der 404 ou erro, mantemos o preview nulo para mostrar o ícone de User
                console.error("Erro ao carregar foto do perfil via API:", error)
                setPreview(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCurrentImage()
    }, [defaultValue])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onFileSelect(file)
            // Para arquivos locais, usamos createObjectURL para performance
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
        }
    }

    return (
        <div className="relative group w-24 h-24">
            <div
                onClick={() => !isLoading && fileInputRef.current?.click()}
                className="w-full h-full rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors bg-muted/50"
            >
                {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                ) : preview ? (
                    <img
                        src={preview}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                        // Fallback caso a URL do objeto falhe
                        onError={() => setPreview(null)}
                    />
                ) : (
                    <User className="h-10 w-10 text-muted-foreground/40" />
                )}

                {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    )
}