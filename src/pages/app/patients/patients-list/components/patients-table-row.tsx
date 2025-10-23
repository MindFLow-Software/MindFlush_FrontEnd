import { Search, Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { PatientsDetails } from './patients-details'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PatientsTableRowProps {
    patient: {
        id: string
        cpf: string
        firstName: string
        lastName: string
        dateOfBirth: string
        phoneNumber: string
        gender: string
        status?: string
        email?: string
    }
}

export function PatientsTableRow({ patient }: PatientsTableRowProps) {
    const { cpf, email, firstName, lastName, dateOfBirth, phoneNumber, gender, status } = patient

    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do paciente</span>
                        </Button>
                    </DialogTrigger>
                    <PatientsDetails />
                </Dialog>
            </TableCell>

            <TableCell className="font-medium">{cpf}</TableCell>
            <TableCell className="font-medium">{firstName} {lastName}</TableCell>
            <TableCell className="text-muted-foreground">{phoneNumber}</TableCell>
            <TableCell className="text-muted-foreground">{new Date(dateOfBirth).toLocaleDateString()}</TableCell>
            <TableCell className="text-muted-foreground">{email}</TableCell>
            <TableCell className="text-muted-foreground">{gender}</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${status === "Ativo" ? "bg-green-500" : "bg-slate-400"
                        }`} />
                    <span className="font-medium text-muted-foreground">
                        {status || "Em acompanhamento"}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                    <UserPen className="h-4 w-4" />
                                    <span className="sr-only">Editar paciente</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Editar paciente</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir paciente</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Excluir paciente</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}
