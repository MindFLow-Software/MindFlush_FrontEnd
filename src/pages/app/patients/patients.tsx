import { Helmet } from 'react-helmet-async'

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { PatitentsTableRow } from './patients-table-row'
import { PatientsTableFilters } from './patients-table-filters'
import { Pagination } from '@/components/pagination'

export function Patients() {
    return (
        <>
            <Helmet title="Pacientes" />

            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                <div className="space-y-2.5">
                    <PatientsTableFilters />

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]" />
                                    <TableHead className="w-[140px]">CPF</TableHead>
                                    <TableHead className='w-[160px]'>Paciente</TableHead>
                                    <TableHead className="w-[160px]">Data de Nascimento</TableHead>
                                    <TableHead className="w-[140px]">Próxima Sessão</TableHead>
                                    <TableHead className="w-[140px]">Status</TableHead>
                                    <TableHead className="w-[164px]" />
                                    <TableHead className="w-[132px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 10 }).map((_, i) => {
                                    return <PatitentsTableRow key={i} />
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination pageIndex={0} totalCount={105} perPage={10} />
                </div>

            </div>
        </>
    )
}