// formatCPF.ts
/**
 * Formata CPF para XXX.XXX.XXX-XX
 * Recebe qualquer string (com ou sem máscara) e retorna a string formatada.
 * Se não for um CPF válido (11 dígitos), retorna a string limpa (somente números).
 */
export function formatCPF(raw: string): string {
  if (!raw) return raw
  const cleaned = String(raw).replace(/\D/g, '')

  if (/^\d{11}$/.test(cleaned)) {
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  // fallback: retorna somente os números (ou você pode retornar raw)
  return cleaned
}
