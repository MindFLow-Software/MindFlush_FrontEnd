import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Simulação das funções de utilidade (se necessário)
// import { formatCPF } from "@/utils/formatCPF";
// import { formatPhone } from "@/utils/formatPhone";

// Interface para os dados do paciente (ajuste conforme a tipagem real da sua API)
interface PatientData {
    id: string;
    firstName: string;
    lastName: string;
    cpf: string;
    email: string;
    phoneNumber: string;
    status: "active" | "pending_session" | "inactive";
    sessions: {
        date: string; // Ex: "10/10/2025"
        theme: string;
        duration: string;
        status: "Pendente" | "Concluída";
    }[];
}

interface PatientsDetailsProps {
    patient: PatientData;
}

// Helper para determinar a cor do status
const getStatusBadge = (status: PatientData['status'], sessionStatus?: string) => {
    if (sessionStatus === "Pendente") {
        return { color: "bg-yellow-400", label: "Sessão pendente" };
    }
    switch (status) {
        case "active":
            return { color: "bg-green-500", label: "Ativo" };
        case "pending_session":
            return { color: "bg-yellow-400", label: "Sessão pendente" };
        case "inactive":
            return { color: "bg-red-500", label: "Inativo" };
        default:
            return { color: "bg-gray-400", label: "Status Desconhecido" };
    }
};

export function PatientsDetails({ patient }: PatientsDetailsProps) {
    // Para simplificar, vou usar as funções de formatação originais se você as tiver
    const formattedCPF = patient.cpf // Assumindo que a função formatCPF foi usada antes de passar aqui ou que a string já está formatada
    const formattedPhone = patient.phoneNumber // Assumindo que a função formatPhone foi usada antes de passar aqui ou que a string já está formatada
    
    // Calcula o total de sessões
    const totalSessions = patient.sessions.length;
    
    const overallStatus = getStatusBadge(patient.status, patient.sessions.some(s => s.status === "Pendente") ? "Pendente" : undefined);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Paciente: {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription>
                    Detalhes do paciente e histórico de sessões
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                {/* Tabela de Detalhes do Paciente */}
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Status</TableCell>
                            <TableCell className="flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${overallStatus.color}`} />
                                    <span className="font-medium text-muted-foreground">
                                        {overallStatus.label}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Nome completo</TableCell>
                            <TableCell className="flex justify-end font-medium">
                                {patient.firstName} {patient.lastName}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">CPF</TableCell>
                            <TableCell className="flex justify-end">
                                {/* Usando o dado da prop */}
                                {formattedCPF} 
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end">
                                {/* Usando o dado da prop */}
                                {patient.email}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end">
                                {/* Usando o dado da prop */}
                                {formattedPhone}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Tabela de Histórico de Sessões */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tema da Sessão</TableHead>
                            <TableHead className="text-right">Duração</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {patient.sessions.map((session, index) => (
                            <TableRow key={index}>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.theme}</TableCell>
                                <TableCell className="text-right">{session.duration}</TableCell>
                                <TableCell 
                                    className={`text-right ${session.status === "Concluída" ? "text-green-500" : "text-yellow-500"}`}
                                >
                                    {session.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total de sessões</TableCell>
                            <TableCell className="text-right font-medium">
                                {totalSessions}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DialogContent>
    )
}

/*
// Exemplo de como você usaria este componente (apenas para referência)

const examplePatient: PatientData = {
    id: "1",
    firstName: "Mariana",
    lastName: "Silva",
    cpf: "123.456.789-00",
    email: "mariana.silva@gmail.com",
    phoneNumber: "(11) 99876-5432",
    status: "pending_session", // ou "active"
    sessions: [
        { date: "10/10/2025", theme: "Ansiedade e rotina", duration: "50 min", status: "Pendente" },
        { date: "03/10/2025", theme: "Autoestima e autoconfiança", duration: "55 min", status: "Concluída" },
    ],
};

// <PatientsDetails patient={examplePatient} />
*/