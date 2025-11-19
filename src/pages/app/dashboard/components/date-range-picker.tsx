"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { type DateRange } from "react-day-picker"

interface DateRangePickerProps {
    onChange?: (range: { from: Date; to: Date }) => void
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    function handleSelect(newDate: DateRange | undefined) {
        setDate(newDate)
        
        if (onChange && newDate?.from && newDate.to) {
            onChange({ from: newDate.from, to: newDate.to })
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild className="cursor-pointer">
                <Button
                    variant="outline"
                    className={cn(
                        "w-[260px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                                {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                            </>
                        ) : (
                            format(date.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                    ) : (
                        <span>Selecionar período</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    locale={ptBR}
                />
            </PopoverContent>
        </Popover>
    )
}