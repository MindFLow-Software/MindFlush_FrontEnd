"use client"

import { useEffect, useRef } from "react"
import { CalendarPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterAppointment } from "./register-appointment"

const appointmentsFilterSchema = z.object({
    name: z.string().optional(),
    status: z.string().optional(),
})

type AppointmentsFilterSchema = z.infer<typeof appointmentsFilterSchema>

export function AppointmentsTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const name = searchParams.get("name")
    const status = searchParams.get("status")

    const { watch } = useForm<AppointmentsFilterSchema>({
        resolver: zodResolver(appointmentsFilterSchema),
        defaultValues: {
            name: name ?? "",
            status: status ?? "all",
        },
    })

    const watchedName = watch("name")
    const watchedStatus = watch("status")

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setSearchParams((state) => {
                if (watchedName) state.set("name", watchedName)
                else state.delete("name")

                if (watchedStatus && watchedStatus !== "all") state.set("status", watchedStatus)
                else state.delete("status")

                state.set("pageIndex", "1")
                return state
            })
        }, 400)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [watchedName, watchedStatus, setSearchParams])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <form
                    className="flex flex-col lg:flex-row gap-3 flex-1 lg:items-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                </form>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="default"
                            className="h-10 gap-2 w-full lg:w-auto shrink-0 cursor-pointer bg-primary hover:bg-primary/90 transition-colors"
                        >
                            <CalendarPlus className="h-4 w-4" />
                            Novo agendamento
                        </Button>
                    </DialogTrigger>
                    <RegisterAppointment />
                </Dialog>
            </div>
        </div>
    )
}