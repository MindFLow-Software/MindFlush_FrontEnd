import { RotateCw } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const CompletedTransactionsCard = () => {
  const displayValue = "0"
  const description = "Transações completas"

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl",
        "border border-border/60 border-b-[3px] border-b-slate-700 dark:border-b-slate-500",
        "shadow-md shadow-black/20 dark:shadow-black/8",
        "bg-card transition-all",
        "p-4"
      )}
    >

      <img
        src={'/transaction.svg'}
        alt="Ícone de Cérebro/Ideia"
        className={cn(
          "absolute bottom-0 right-0", // Posição
          "w-3xl h-auto max-w-[150px]", // Tamanho
          "opacity-70", // <-- Novo: Valor único para Light e Dark
          "pointer-events-none",        // Garante que não interfira no clique
          "translate-x-1/4 translate-y-1/4" // Move a imagem para fora do Card ligeiramente
        )}
      />


      {/* Glow circular */}
      <div
        className={cn(
          "absolute -top-14 -right-14",
          "w-40 h-40 rounded-full",
          "bg-gradient-to-r from-slate-400/50 to-slate-700/30 dark:from-slate-400/70 dark:to-slate-900",
          "blur-3xl opacity-60 pointer-events-none"
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">

        {/* Ícone */}
        <div className="rounded-full bg-slate-100/80 dark:bg-slate-950/40 p-2 w-fit">
          <RotateCw className="size-5 text-slate-700 dark:text-slate-400" />
        </div>

        {/* Valor e descrição */}
        <div className="flex flex-col gap-1.5">
          <span className="text-2xl font-semibold tracking-tight leading-none">
            {displayValue}
          </span>
          <p className="text-[13px] text-muted-foreground font-medium leading-none">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}
