// formatPhone.ts
/**
 * Formata telefone brasileiro para (XX) XXXXX-XXXX
 * Recebe qualquer string (com ou sem máscara) e retorna a string formatada.
 * Se não for um telefone válido (11 dígitos), retorna a string limpa (somente números).
 */
export function formatPhone(raw: string): string {
  if (!raw) return raw
  const cleaned = String(raw).replace(/\D/g, '')

  // formato esperado: 11 dígitos (2 DDD + 9 número)
  if (/^(\d{2})(\d{5})(\d{4})$/.test(cleaned)) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  // tenta formatar 10 dígitos (caso número com 8 dígitos sem nono)
  if (/^(\d{2})(\d{4})(\d{4})$/.test(cleaned)) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }

  // se não bater, retorna só os números (fallback)
  return cleaned
}
