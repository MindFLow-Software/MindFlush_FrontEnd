"use client"

import { useState } from "react"
import { ControlBar } from "./control-bar"

interface ParticipantTileMockProps {
    name: string;
    isLocal: boolean;
    isMuted: boolean;
    isVideoEnabled: boolean;
    isFocus?: boolean;
}

const ParticipantTileMock: React.FC<ParticipantTileMockProps> = ({
    name,
    isLocal,
    isVideoEnabled,
    isFocus = false
}) => {
    return (
        <div
            className={`relative flex items-center justify-center bg-gray-900 text-white rounded-lg overflow-hidden border-4 transition-all duration-300
                       ${isFocus ? "border-primary/80 h-full w-full" : "border-gray-600 h-28 w-48 sm:h-28 sm:w-48 lg:h-28 lg:w-full"}
                       ${isLocal ? "order-last lg:order-none" : ""}`}
        >
            {!isVideoEnabled && (
                <div className="flex flex-col items-center">
                    <p className="mt-2 text-gray-400 text-sm">Câmera Desligada</p>
                </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-1 rounded">
                <span className="text-sm font-semibold truncate">
                    {name} {isLocal && "(Você)"}
                </span>
            </div>
        </div>
    );
};


export function VideoRoomMock() {
    const [isMicMuted, setIsMicMuted] = useState(false)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)

    const localParticipant = {
        name: "João Silva",
        isLocal: true,
        isMuted: isMicMuted,
        isVideoEnabled: isVideoEnabled,
    }

    const remoteParticipant = {
        name: "Dr(a). Maria Oliveira",
        isLocal: false,
        isMuted: false,
        isVideoEnabled: true,
    }

    return (
        <div className="flex flex-col w-full min-h-[500px] bg-gray-800 rounded-lg overflow-hidden border shadow-xl">

            <div className="flex-1 flex flex-col lg:flex-row p-3 gap-3 bg-gray-900">

                <div className="flex-1 min-h-[300px] lg:min-h-full">
                    <ParticipantTileMock
                        {...remoteParticipant}
                        isFocus={true}
                    />
                </div>

                <div className="h-auto lg:h-full lg:w-48 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto p-1">
                    <ParticipantTileMock
                        {...localParticipant}
                        isFocus={false}
                    />
                    <div className="flex-shrink-0 h-28 w-48 sm:h-28 sm:w-48 lg:h-28 lg:w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        +1
                    </div>
                </div>
            </div>

            <ControlBar
                isMicMuted={isMicMuted}
                isVideoEnabled={isVideoEnabled}
                isScreenSharing={isScreenSharing}
                participantCount={2}
                onToggleMic={() => setIsMicMuted((prev) => !prev)}
                onToggleVideo={() => setIsVideoEnabled((prev) => !prev)}
                onToggleScreenShare={() => setIsScreenSharing((prev) => !prev)}
                onSettings={() => console.log("Abrir configurações")}
                onLeave={() => console.log("Encerrar chamada")}
            />
        </div>
    )
}