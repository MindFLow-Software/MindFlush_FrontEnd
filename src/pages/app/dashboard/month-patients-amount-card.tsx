import { Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthPatientsAmountCard() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-semibold">
                    Pacientes atendidos (mês)
                    <Users className="size-5 text-blue-500 dark:text-blue-400" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">58</span>
                <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 dark:text-emerald-400">+12%</span> em
                    relação ao mês anterior
                </p>
            </CardContent>
        </Card>
    )
}
