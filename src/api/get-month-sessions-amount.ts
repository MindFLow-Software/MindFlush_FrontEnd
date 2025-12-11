import { api } from "@/lib/axios"

export interface GetMonthSessionsAmountResponse {
    total: number
    diffFromLastMonth: number // Opcional: se o backend calcular a diferença
}

interface GetMonthSessionsAmountParams {
    startDate?: Date
    endDate?: Date
}

export async function getMonthSessionsAmount({
    startDate,
    endDate,
}: GetMonthSessionsAmountParams): Promise<GetMonthSessionsAmountResponse> {
    // Ajuste a rota '/appointments/stats/month-amount' conforme seu backend
    const response = await api.get<GetMonthSessionsAmountResponse>(
        '/appointments/stats/month-amount',
        {
            params: {
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            },
        },
    )

    return response.data
}