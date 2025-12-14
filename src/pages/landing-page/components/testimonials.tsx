"use client"

import { TwitterLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";

// --- Dados dos Depoimentos (Fictícios para Psicólogos) ---
const testimonials = [
    {
        name: "Dra. Ana Clara",
        handle: "@ana.psi",
        content: "Finalmente consegui largar as planilhas do Excel. O MindFlush organizou minha agenda e meus prontuários em um só lugar. Indispensável!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
    },
    {
        name: "Paulo Roberto",
        handle: "@pauloroberto_psi",
        content: "A integração com o Google Agenda salvou minha vida. Meus pacientes recebem o link do Meet automaticamente. Sensacional!",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100"
    },
    {
        name: "Mariana Souza",
        handle: "@marianapsico",
        content: "A parte financeira é incrível. Consigo ver exatamente quanto recebi e quem está pendente. O design é lindo e muito fácil de usar.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100"
    },
    {
        name: "Carlos Mendes",
        handle: "@carlos.terapia",
        content: "Eu tinha medo de usar software por causa da segurança dos dados. O MindFlush me passou total confiança com a criptografia. Recomendo.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
    },
    {
        name: "Fernanda Lima",
        handle: "@fer.psicologia",
        content: "O suporte é excelente e a plataforma não para de evoluir. É muito bom ver uma ferramenta feita pensada na nossa rotina.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100"
    },
    {
        name: "Dr. Ricardo",
        handle: "@ricardo_psi",
        content: "Simplesmente a melhor plataforma para psicólogos hoje. O prontuário é super intuitivo e rápido de preencher entre as sessões.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
    },
];

// --- Componente do Card Individual ---
function TestimonialCard({ data }: { data: typeof testimonials[0] }) {
    return (
        <div className="relative mx-4 flex h-full w-[350px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={data.image}
                        alt={data.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                        <p className="text-sm font-bold text-slate-900">{data.name}</p>
                        <p className="text-xs text-slate-500">{data.handle}</p>
                    </div>
                </div>
                <TwitterLogo size={20} weight="fill" className="text-blue-400" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
                "{data.content}"
            </p>
        </div>
    );
}

export function TestimonialsSection() {
    return (
        // AQUI: Adicionei o ID "depoimentos" e o "scroll-mt-20"
        <section id="depoimentos" className="bg-slate-50 py-24 overflow-hidden scroll-mt-20">

            {/* Injeção de CSS para a animação (Marquee) */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: scroll 40s linear infinite;
                }
                .animate-marquee-reverse {
                    animation: scroll 45s linear infinite reverse;
                }
                /* Pausa a animação ao passar o mouse */
                .group:hover .animate-marquee,
                .group:hover .animate-marquee-reverse {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="container mx-auto mb-16 px-6 text-center md:px-8 lg:px-12">
                {/* Badge */}
                <div className="mb-6 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Depoimentos</span>
                    </motion.div>
                </div>

                {/* Título */}
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Histórias reais de quem usa o <br className="hidden sm:block" />
                    <span className="text-blue-600">MindFlush no dia a dia.</span>
                </h2>

                {/* Subtítulo */}
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                    Veja relatos de psicólogos que simplificaram a gestão do consultório e ganharam mais tempo para focar nos pacientes.
                </p>
            </div>

            {/* --- CARROSSEL INFINITO --- */}
            <div className="relative flex w-full flex-col gap-8">

                {/* Efeito de Fade nas laterais (Máscara) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-
                gradient-to-r from-slate-50 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-slate-50 to-transparent"></div>

                {/* LINHA 1 - Move para a Esquerda */}
                <div className="group flex overflow-hidden">
                    <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around gap-4">
                        {[...testimonials, ...testimonials].map((item, idx) => (
                            <TestimonialCard key={`row1-${idx}`} data={item} />
                        ))}
                    </div>
                    {/* Duplicata para garantir o loop sem buracos em telas largas */}
                    <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around gap-4" aria-hidden="true">
                        {[...testimonials, ...testimonials].map((item, idx) => (
                            <TestimonialCard key={`row1-dup-${idx}`} data={item} />
                        ))}
                    </div>
                </div>

                {/* LINHA 2 - Move para a Direita (Reverse) */}
                <div className="group flex overflow-hidden">
                    <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center justify-around gap-4">
                        {/* Inverti a ordem do array para variar os cards */}
                        {[...testimonials].reverse().concat([...testimonials].reverse()).map((item, idx) => (
                            <TestimonialCard key={`row2-${idx}`} data={item} />
                        ))}
                    </div>
                    <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center justify-around gap-4" aria-hidden="true">
                        {[...testimonials].reverse().concat([...testimonials].reverse()).map((item, idx) => (
                            <TestimonialCard key={`row2-dup-${idx}`} data={item} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}