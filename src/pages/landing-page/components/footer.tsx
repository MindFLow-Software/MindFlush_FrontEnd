import { Link } from "react-router-dom";
import {
    Brain,
    InstagramLogo,
    LinkedinLogoIcon,
    TwitterLogo,
    YoutubeLogo
} from "@phosphor-icons/react";

export function Footer() {
    return (
        <footer className="w-full bg-white pt-16 md:pt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">

                {/* --- PARTE SUPERIOR (Links e Logo) --- */}
                <div className="flex flex-col lg:flex-row lg:gap-8">

                    {/* COLUNA 1: Logo e Marca (Com borda lateral em telas grandes) */}
                    <div className="mb-12 flex flex-col items-start lg:mb-0 lg:w-1/4 lg:border-r lg:border-slate-100 lg:pr-8">
                        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <div className="text-blue-600">
                                <Brain size={32} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                MindFlush
                            </span>
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            Simplificando a gestão de clínicas de psicologia em todo o Brasil.
                        </p>
                    </div>

                    {/* GRIDS DE LINKS (4 Colunas) */}
                    <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4 lg:pl-8">

                        {/* Grupo: Conta */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-semibold text-blue-600">Conta</h4>
                            <nav className="flex flex-col gap-3">
                                <Link to="/sign-up" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Cadastre-se
                                </Link>
                                <Link to="/sign-in" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Login
                                </Link>
                            </nav>
                        </div>

                        {/* Grupo: Suporte */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-semibold text-blue-600">Suporte</h4>
                            <nav className="flex flex-col gap-3">
                                <a href="mailto:ajuda@mindflush.com" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    ajuda@mindflush.com
                                </a>
                                <a href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Falar no WhatsApp
                                </a>
                                <a href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Central de Ajuda
                                </a>
                            </nav>
                        </div>

                        {/* Grupo: Website */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-semibold text-blue-600">Website</h4>
                            <nav className="flex flex-col gap-3">
                                <a href="#produtos" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Funcionalidades
                                </a>
                                <a href="#integracoes" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Integrações
                                </a>
                                <a href="#taxas" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Planos e Preços
                                </a>
                                <a href="#documentacao" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Documentação
                                </a>
                            </nav>
                        </div>

                        {/* Grupo: Legal */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-semibold text-blue-600">Legal</h4>
                            <nav className="flex flex-col gap-3">
                                <Link to="/termos" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Termos de uso
                                </Link>
                                <Link to="/privacidade" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Privacidade
                                </Link>
                                <a href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Status do sistema
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* --- PARTE INFERIOR (Copyright e Social) --- */}
                <div className="mt-16 flex flex-col items-center justify-between border-t border-dashed border-slate-200 py-8 md:flex-row">

                    <p className="text-xs text-slate-500 text-center md:text-left">
                        Copyright © 2025 MindFlush Tecnologia Ltda - CNPJ: 00.000.000/0001-00 <br className="hidden md:block" />
                        Todos os direitos reservados.
                    </p>

                    <div className="mt-4 flex gap-6 md:mt-0">
                        <a href="#" className="text-slate-400 transition-colors hover:text-blue-600">
                            <LinkedinLogoIcon size={24} />
                        </a>
                        <a href="#" className="text-slate-400 transition-colors hover:text-pink-600">
                            <InstagramLogo size={24} />
                        </a>
                        <a href="#" className="text-slate-400 transition-colors hover:text-sky-500">
                            <TwitterLogo size={24} />
                        </a>
                        <a href="#" className="text-slate-400 transition-colors hover:text-red-600">
                            <YoutubeLogo size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}