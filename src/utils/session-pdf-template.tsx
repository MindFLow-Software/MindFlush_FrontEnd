"use client"

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: { padding: 50, fontSize: 11, color: '#333', fontFamily: 'Helvetica' },
    header: { marginBottom: 30, borderBottom: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 4 },
    professionalInfo: { fontSize: 10, color: '#6b7280' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    content: { lineHeight: 1.6, textAlign: 'justify', color: '#1f2937' },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#f9fafb', padding: 10, borderRadius: 4 },
    footer: { position: 'absolute', bottom: 40, left: 50, right: 50, borderTop: 1, borderTopColor: '#e5e7eb', paddingTop: 10, textAlign: 'center', fontSize: 9, color: '#9ca3af' }
})

// 🟢 Interface padronizada para aceitar propriedades simples
export interface SessionPDFProps {
    psychologist: { name: string; crp?: string | null }
    patientName: string
    date: string      // String já formatada
    content: string   // Conteúdo da nota
    diagnosis?: string // Tema ou diagnóstico
}

export function SessionPDFTemplate({ psychologist, patientName, date, content, diagnosis }: SessionPDFProps) {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Prontuário de Atendimento Clínico</Text>
                    <Text style={styles.professionalInfo}>
                        {psychologist.name}
                        {psychologist.crp ? ` | CRP: ${psychologist.crp}` : ''}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <View>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>Paciente</Text>
                        <Text style={{ fontWeight: 'bold' }}>{patientName}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>Data da Sessão</Text>
                        <Text style={{ fontWeight: 'bold' }}>{date}</Text>
                    </View>
                </View>

                {diagnosis && diagnosis !== "Sem tema registrado" && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tema / Diagnóstico</Text>
                        <Text style={styles.content}>{diagnosis}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evolução Psicológica</Text>
                    <Text style={styles.content}>{content}</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Documento gerado em {new Date().toLocaleDateString('pt-BR')}</Text>
                    <Text>Confidencial - Conforme Código de Ética Profissional.</Text>
                </View>
            </Page>
        </Document>
    )
}