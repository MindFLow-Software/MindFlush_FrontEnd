"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { EditAppointment } from "./edit-appointment-dialog"
import { RegisterAppointment } from "./register-appointment"
import { CancelAppointmentDialog } from "./cancel-appointment-dialog"
import { RescheduleAppointmentDialog } from "./reschedule-appointment-dialog"

interface AppointmentDialogManagerProps {
    states: {
        create: boolean
        edit: boolean
        cancel: boolean
        reschedule: boolean
    }
    setStates: (key: string, value: boolean) => void
    selectedDate?: Date
    selectedAppointment: any | null
    mutations: {
        cancel: (id: string) => Promise<void>
        reschedule: (data: { appointmentId: string; newDate: Date }) => Promise<void>
    }
    onSuccess: () => void
}

export function AppointmentDialogManager({
    states,
    setStates,
    selectedDate,
    selectedAppointment,
    mutations,
    onSuccess
}: AppointmentDialogManagerProps) {
    // Helper para extrair ID e Nome de forma segura
    const appData = selectedAppointment ? {
        id: selectedAppointment.id || selectedAppointment.props?.id,
        name: selectedAppointment.patientName || "Paciente"
    } : null

    return (
        <>
            <Dialog open={states.create} onOpenChange={(v) => setStates('create', v)}>
                <RegisterAppointment
                    initialDate={selectedDate}
                    onSuccess={() => { onSuccess(); setStates('create', false); }}
                />
            </Dialog>

            <Dialog open={states.edit} onOpenChange={(v) => setStates('edit', v)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                    <DialogTitle className="sr-only">Detalhes</DialogTitle>
                    <DialogDescription className="sr-only">Ações da sessão</DialogDescription>
                    {selectedAppointment && (
                        <EditAppointment
                            appointment={selectedAppointment}
                            onClose={() => setStates('edit', false)}
                            onCancelTrigger={() => setStates('cancel', true)}
                            onRescheduleTrigger={() => setStates('reschedule', true)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={states.cancel} onOpenChange={(v) => setStates('cancel', v)}>
                <DialogContent className="p-0 border-none max-w-[400px] rounded-xl">
                    {appData && (
                        <CancelAppointmentDialog
                            patientName={appData.name}
                            onClose={() => setStates('cancel', false)}
                            onCancel={() => mutations.cancel(appData.id)} isCancelling={false}                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={states.reschedule} onOpenChange={(v) => setStates('reschedule', v)}>
                <DialogContent className="p-0 border-none max-w-md rounded-xl">
                    {appData && (
                        <RescheduleAppointmentDialog
                            patientName={appData.name}
                            onClose={() => setStates('reschedule', false)}
                            onReschedule={(date) => mutations.reschedule({ appointmentId: appData.id, newDate: date })} isRescheduling={false}                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}