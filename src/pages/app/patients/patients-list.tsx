import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { getPatients, type GetPatientsResponse } from "@/api/get-patients"
import { PatientsTable } from "./components/patients-table-row"
import { useHeaderStore } from "@/hooks/use-header-store"

export function PatientsList() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Cadastro de Pacientes')
    }, [setTitle])

    const [searchParams, setSearchParams] = useSearchParams()

    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const perPage = 12

    const name = searchParams.get('name') || undefined
    const cpf = searchParams.get('cpf') || undefined
    const status = searchParams.get('status') || undefined

    const { data: result, isLoading, isError } = useQuery<GetPatientsResponse>({
        queryKey: ["patients", pageIndex, perPage, name, cpf, status],
        queryFn: () => getPatients({
            pageIndex,
            perPage,
            name,
            cpf,
            status,
        }),
        staleTime: 1000 * 60 * 5,
    })

    const patients = result?.patients ?? []
    const meta = result?.meta ?? { pageIndex: 0, perPage, totalCount: 0 }

    const handlePaginate = (newPageIndex: number) => {
        setSearchParams((state) => {
            state.set('pageIndex', String(newPageIndex))
            return state
        })
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 font-medium">Erro ao carregar pacientes 😕</p>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Cadastro de Pacientes" />

            <div className="flex flex-col gap-4 mt-6">
                <div className="space-y-5">
                    <PatientsTableFilters />

                    <PatientsTable
                        patients={patients}
                        isLoading={isLoading}
                        perPage={perPage}
                    />

                    {result && (
                        <Pagination
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={handlePaginate}
                        />
                    )}
                </div>
            </div>
        </>
    )
}