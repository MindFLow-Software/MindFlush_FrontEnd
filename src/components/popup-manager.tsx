"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchUnseenPopups, markPopupAsViewed } from "@/api/popups"
import { WelcomeModal } from "./popups/welcome-modal"
import { AchievementToast } from "./popups/achievement-toast"

export function PopupManager() {
    const queryClient = useQueryClient()

    const { data: popups } = useQuery({
        queryKey: ['unseen-popups'],
        queryFn: fetchUnseenPopups,
        staleTime: Infinity,
    })

    // 2. Mutation para marcar como visualizado no banco de dados
    const { mutate: registerView } = useMutation({
        mutationFn: ({ id, action }: { id: string; action: string }) =>
            markPopupAsViewed(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unseen-popups'] })
        }
    })

    if (!popups || popups.length === 0) return null

    const currentPopup = popups[0]

    const handleClose = (action: string) => {
        registerView({ id: currentPopup.id, action })
    }

    if (currentPopup.type === 'TOAST') {
        return (
            <AchievementToast
                key={currentPopup.id}
                popup={currentPopup}
                onClose={handleClose}
            />
        )
    }

    return (
        <WelcomeModal
            key={currentPopup.id}
            popup={currentPopup}
            onClose={handleClose}
        />
    )
}