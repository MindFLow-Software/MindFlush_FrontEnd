"use client"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CloudDownload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RegisterPatients() {
    const [date, setDate] = useState<Date | undefined>()

    return (
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Novo Paciente</DialogTitle>
                <DialogDescription>Preencha os dados para cadastrar um novo paciente</DialogDescription>
            </DialogHeader>

            <form className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Primeiro Nome</Label>
                            <Input id="firstName" placeholder="Ex: Mariana" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Último Nome</Label>
                            <Input id="lastName" placeholder="Ex: Silva" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input id="cpf" placeholder="000.000.000-00" />
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefone</Label>
                            <Input id="phoneNumber" placeholder="(11) 99999-9999" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="exemplo@email.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" placeholder="Mínimo 6 caracteres" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                    {/* Gênero */}
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FEMININE">Feminino</SelectItem>
                                <SelectItem value="MASCULINE">Masculino</SelectItem>
                                <SelectItem value="OTHER">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Perfil */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil</Label>
                        <Select defaultValue="PATIENT">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PATIENT">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ativo */}
                    <div className="space-y-2">
                        <Label htmlFor="isActive">Ativo?</Label>
                        <Select defaultValue="true">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="profileImageUrl">URL da Foto</Label>
                    <Input id="profileImageUrl" placeholder="https://exemplo.com/foto.jpg" />
                </div>

                <div>
                    <Empty className="border border-dashed py-6">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload className="h-8 w-8" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base">Sem Documentos</EmptyTitle>
                            <EmptyDescription className="text-sm">Faça o upload dos documentos do paciente</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" size="sm" type="button">
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>

                {/* Botão Cadastrar */}
                <div className="pt-2">
                    <Button type="submit" className="w-full">
                        Cadastrar paciente
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}
