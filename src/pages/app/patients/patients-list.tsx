"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"

import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { PatientsTable } from "./components/patients-table-row"
import { useHeaderStore } from "@/hooks/use-header-store"
import { AchievementToast } from "@/components/achievement-toast"

import { getPatients, type GetPatientsResponse, type GetPatientsFilters } from "@/api/get-patients" // Importamos GetPatientsFilters para tipagem
import { usePatientAchievements } from "@/hooks/use-patient-achievements"
import { usePatientFilters } from "@/hooks/use-patient-filters"


export function PatientsList() {
    const { setTitle } = useHeaderStore()

    const { filters, setPage } = usePatientFilters() as unknown as { filters: GetPatientsFilters, setPage: (pageIndex: number) => void };

    const { achievement, checkAchievement, clearAchievement } = usePatientAchievements()

    useEffect(() => {
        setTitle('Cadastro de Pacientes')
    }, [setTitle])

    // 🔍 LOG DE DEBUG
    console.log("Filtros Atuais para useQuery:", filters)

    // 3. Busca de Dados
    const { data: result, isLoading, isError } = useQuery<GetPatientsResponse>({
        queryKey: ["patients", filters.pageIndex, filters.perPage, filters.filter, filters.status],
        queryFn: () => getPatients(filters),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })

    const patients = result?.patients ?? []
    const meta = result?.meta ?? { pageIndex: 0, perPage: filters.perPage, totalCount: 0 }

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
                    {/* Filtros */}
                    <PatientsTableFilters onPatientRegistered={checkAchievement} />

                    <PatientsTable
                        patients={patients}
                        isLoading={isLoading}
                        perPage={filters.perPage}
                    />

                    {/* Paginação (Layout original restaurado) */}
                    {result && meta.totalCount > 0 && (
                        <Pagination
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>

            {/* Toaster de Conquistas */}
            {achievement && (
                <AchievementToast
                    title={achievement.title}
                    description={achievement.description}
                    variant={achievement.variant}
                    onClose={clearAchievement}
                />
            )}
        </>
    )
}