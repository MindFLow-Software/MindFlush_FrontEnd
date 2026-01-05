import { api } from '@/lib/axios'

export interface Popup {
  id: string
  internalName: string
  title: string | null
  body: string | null
  type: 'MODAL' | 'TOAST' | 'SLIDE_IN'
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
}

export async function fetchUnseenPopups() {
  const response = await api.get<{ popups: Popup[] }>('/popups/unseen')
  return response.data.popups
}

export async function markPopupAsViewed(popupId: string, action: string) {
  await api.post(`/popups/${popupId}/view`, { action })
}