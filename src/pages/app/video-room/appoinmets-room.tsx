"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentAddForm } from "./components/appointment-add-form"
import { VideoRoomMock } from "./components/video-room"


export interface SessionItem {
    id: number
    procedure: string
    duration: string
    status: "Concluído" | "Em Andamento" | "Pendente"
}

export function AppointmentsRoom() {
    const [selectedProcedure, setSelectedProcedure] = useState("")
    const [notes, setNotes] = useState("")
    const [sessionItems, setSessionItems] = useState<SessionItem[]>([
        { id: 1, procedure: "Consulta Inicial", duration: "60 min", status: "Concluído" },
        { id: 2, procedure: "Aconselhamento Breve", duration: "20 min", status: "Em Andamento" },
    ])

    const handleAddItem = (procedure: string) => {
        const newItem: SessionItem = {
            id: sessionItems.length + 1,
            procedure,
            duration: "N/A",
            status: "Em Andamento",
        }
        setSessionItems([...sessionItems, newItem])
        setSelectedProcedure("")
    }

    const handleFinishSession = () => {
        console.log("Sessão finalizada com anotações:", notes)
    }

    const MAX_LENGTH = 5000;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;

        if (value.length > MAX_LENGTH) {
            value = value.substring(0, MAX_LENGTH);
        }

        setNotes(value);
    };


    return (
        <>
            <Helmet title="Sala de Atendimento" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Sala de Atendimento
                </h1>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <div className="lg:col-span-1">
                        <VideoRoomMock />

                    </div>
                </div>



                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <div className="lg:col-span-1">
                        <AppointmentAddForm
                            selectedProcedure={selectedProcedure}
                            onSelectProcedure={setSelectedProcedure}
                            onAddItem={handleAddItem}
                            onFinishSession={handleFinishSession}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-1 hidden lg:block">
                    </div>
                </div>


                <Card className="mt-2">
                    <CardHeader>
                        <CardTitle>Anotações e Evolução</CardTitle>
                        <CardDescription>Registre a evolução e observações do paciente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notas (opcional)
                            </label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Adicione observações..."
                                value={notes}
                                onChange={handleNotesChange}
                                maxLength={MAX_LENGTH}
                                rows={4}
                                className="w-full resize-none overflow-y-auto"
                                style={{
                                    wordBreak: "break-all",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                }}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {notes.length}/{MAX_LENGTH} caracteres
                            </div>
                        </div>

                        <Button disabled={!notes.trim()} className="w-full sm:w-auto">
                            Salvar Anotações
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}