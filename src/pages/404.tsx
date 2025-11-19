import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Brain } from "@phosphor-icons/react";

export function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted/20 px-4">
            <div className="mx-auto max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                        <div>
                            <Brain className="h-26 w-26 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
                    <p className="text-muted-foreground text-balance leading-relaxed">
                        Parece que você se perdeu. Não se preocupe, isso acontece com todos nós. Vamos te ajudar a voltar para um
                        lugar seguro.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild size="lg" className="gap-2">
                        <Link to="/">
                            <Home className="h-4 w-4" />
                            Voltar ao Inicio
                        </Link>
                    </Button>
                </div>

                {/* Supportive message */}
                <p className="text-xl text-muted-foreground pt-8 italic">
                    "Cada passo, mesmo os perdidos, fazem parte da jornada."
                </p>
            </div>
        </div>
    )
}
