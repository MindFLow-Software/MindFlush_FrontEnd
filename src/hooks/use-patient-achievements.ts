"use client"

import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

export function usePatientAchievements() {
  const queryClient = useQueryClient()

  const checkAchievement = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['unseen-popups'] })
  }, [queryClient])

  return { 
    checkAchievement 
  }
}