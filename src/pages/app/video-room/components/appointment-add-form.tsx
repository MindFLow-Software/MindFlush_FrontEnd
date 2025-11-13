"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle2 } from "lucide-react"

const availableProcedures = [
  { id: "1", name: "Consulta Inicial" },
  { id: "2", name: "Sessão de Acompanhamento" },
  { id: "3", name: "Procedimento Padrão A" },
  { id: "4", name: "Avaliação de Progresso" },
]

interface AppointmentAddFormProps {
  selectedProcedure: string
  onSelectProcedure: (value: string) => void
  onAddItem: (procedure: string) => void
  onFinishSession: () => void
}

export function AppointmentAddForm({
  selectedProcedure,
  onSelectProcedure,
  onAddItem,
  onFinishSession,
}: AppointmentAddFormProps) {
  const handleAdd = () => {
    const procedure = availableProcedures.find((p) => p.id === selectedProcedure)
    if (procedure) {
      onAddItem(procedure.name)
    }
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Adicionar Procedimento
        </CardTitle>
        <CardDescription>Selecione e adicione um novo procedimento à sessão</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Procedimento</label>
          <Select value={selectedProcedure} onValueChange={onSelectProcedure}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um procedimento..." />
            </SelectTrigger>
            <SelectContent>
              {availableProcedures.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAdd} disabled={!selectedProcedure} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Procedimento
        </Button>

        <div className="my-4 border-t" />

        <Button
          onClick={onFinishSession}
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 bg-transparent"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Finalizar Sessão
        </Button>
      </CardContent>
    </Card>
  )
}
