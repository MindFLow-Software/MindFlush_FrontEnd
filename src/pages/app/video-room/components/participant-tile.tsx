"use client"

import { Users, Mic, MicOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ParticipantTileProps {
  name: string
  isLocal: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  isFocus?: boolean
}

export function ParticipantTile({ name, isLocal, isMuted, isVideoEnabled, isFocus = false }: ParticipantTileProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl transition-all duration-300
        ${
          isFocus
            ? "border-2 border-primary/60 h-full w-full bg-gradient-to-br from-slate-900 to-slate-950"
            : "border border-slate-700 h-28 w-48 sm:h-40 sm:w-64 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-slate-600"
        }`}
    >
      {/* Video Content Area */}
      {!isVideoEnabled ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-slate-700/50 p-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-xs text-slate-400">Câmera desligada</p>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      )}

      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top Info - Focus Mode Only */}
        {isFocus && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-slate-700/60 text-slate-100">
              {isLocal ? "Você" : "Apresentador"}
            </Badge>
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-white truncate flex-1" title={name}>
            {name}
          </span>
          <div className={`flex-shrink-0 rounded-full p-1.5 ${isMuted ? "bg-red-500/20" : "bg-green-500/20"}`}>
            {isMuted ? (
              <MicOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
            ) : (
              <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
