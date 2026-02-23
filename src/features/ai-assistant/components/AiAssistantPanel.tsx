// src/features/ai-assistant/components/AiAssistantPanel.tsx
import { useState, useRef, useEffect } from 'react'
import { AudioSourceSelector } from './AudioSourceSelector'

export function AiAssistantPanel() {
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
    const [isListening, setIsListening] = useState(false)
    const [volumeLevel, setVolumeLevel] = useState(0)

    // ✅ NOU: Aici vom stoca titlurile sugerate de AI
    const [suggestedTitles, setSuggestedTitles] = useState<string[]>([])

    const audioContextRef = useRef<AudioContext | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    // ✅ NOU: Referința pentru MediaRecorder care capturează bucățile de sunet
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    // Ascultăm mesajele venite de la Electron (Titluri generate sau Erori)
    useEffect(() => {
        // Când primim un titlu nou de la AI, îl adăugăm în lista noastră
        const unsubscribeTitle = window.electronAPI.onAiSuggestedTitle((title) => {
            setSuggestedTitles(prev => [title, ...prev])
        })

        const unsubscribeError = window.electronAPI.onAiError((errorMsg) => {
            console.error("Eroare de la AI:", errorMsg)
            // Aici poți afișa un toast/alert cu eroarea dacă dorești
        })

        // Cleanup la demontarea componentei
        return () => {
            unsubscribeTitle()
            unsubscribeError()
        }
    }, [])

    const handleAudioSourceChange = (deviceId: string) => {
        setSelectedDeviceId(deviceId)
        if (isListening) {
            stopListening()
            setTimeout(() => startListening(deviceId), 100)
        }
    }

    // Oprim totul dacă închidem aplicația sau componenta dispare
    useEffect(() => {
        return () => {
            stopListening()
        }
    }, [])

    const startListening = async (deviceIdToUse: string) => {
        try {
            // ✅ 1. Anunțăm backend-ul (Electron) că pornim
            await window.electronAPI.startAiListening()

            // 2. Cerem stream-ul audio
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: deviceIdToUse ? { exact: deviceIdToUse } : undefined,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 16000, // Forțăm 16kHz
                    channelCount: 1,   // Forțăm Mono
                }
            })
            mediaStreamRef.current = stream

            // 3. Setăm Vu-Metrul Vizual (la fel ca înainte)
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
            audioContextRef.current = audioCtx
            const source = audioCtx.createMediaStreamSource(stream)
            const analyser = audioCtx.createAnalyser()
            analyser.fftSize = 256
            source.connect(analyser)
            analyserRef.current = analyser

            const dataArray = new Uint8Array(analyser.frequencyBinCount)
            const updateVolume = () => {
                if (!analyserRef.current) return
                analyserRef.current.getByteFrequencyData(dataArray)
                let sum = 0
                for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
                const average = sum / dataArray.length
                const percentage = Math.min(100, Math.round((average / 255) * 100 * 1.5))
                setVolumeLevel(percentage)
                animationFrameRef.current = requestAnimationFrame(updateVolume)
            }
            updateVolume()
            setIsListening(true)

            // ✅ 4. MAGIA: Preluăm sunetul real și îl trimitem la Electron
            // Înregistrăm folosind formatul webm care e suportat de API-urile AI
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            mediaRecorderRef.current = mediaRecorder

            // La fiecare X milisecunde, MediaRecorder declanșează acest eveniment
            mediaRecorder.ondataavailable = async (event) => {
                console.log("Pachet audio generat de MediaRecorder:", event.data.size); // ✅ ADAUGĂ ASTA

                if (event.data && event.data.size > 0) {
                    // Transformăm din Blob în ArrayBuffer, apoi în Uint8Array
                    const arrayBuffer = await event.data.arrayBuffer()
                    const chunk = new Uint8Array(arrayBuffer)

                    // Îl trimitem prin țeava IPC direct la ai-handlers.ts!
                    window.electronAPI.sendAiAudioChunk(chunk)
                }
            }

            // Pornim înregistrarea, feliind sunetul în pachete de 250 milisecunde
            mediaRecorder.start(100)

        } catch (error) {
            console.error("Eroare la pornirea stream-ului audio:", error)
            alert("Nu am putut accesa sursa audio. Verifică permisiunile sistemului.")
            setIsListening(false)
        }
    }

    const stopListening = () => {
        setIsListening(false)
        setVolumeLevel(0)

        // ✅ Anunțăm backend-ul (Electron) că ne oprim
        window.electronAPI.stopAiListening().catch(console.error)

        // Oprim MediaRecorder-ul
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        if (analyserRef.current) {
            analyserRef.current.disconnect()
            analyserRef.current = null
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close()
            audioContextRef.current = null
        }
    }

    const handleToggleListening = () => {
        if (!selectedDeviceId) {
            alert("Așteaptă să se încarce sursele audio sau conectează un microfon.")
            return
        }

        if (isListening) stopListening()
        else startListening(selectedDeviceId)
    }

    const getVolumeColor = () => {
        if (volumeLevel < 50) return 'bg-green-500'
        if (volumeLevel < 80) return 'bg-yellow-400'
        return 'bg-red-500'
    }

    return (
        <div className="bg-white rounded border p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="font-bold text-gray-800">Asistent AI Live</h3>
                </div>
            </div>

            <AudioSourceSelector onSelect={handleAudioSourceChange} />

            <div className="w-full h-4 bg-gray-200 rounded overflow-hidden relative">
                <div
                    className={`h-full transition-all duration-75 ease-out ${getVolumeColor()}`}
                    style={{ width: `${volumeLevel}%` }}
                />
                {!isListening && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Inactiv
                    </div>
                )}
            </div>

            <button
                onClick={handleToggleListening}
                className={`py-2 px-4 rounded font-bold text-white transition-colors ${
                    isListening
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isListening ? '⏹ Oprește Ascultarea' : '🎧 Pornește Ascultarea'}
            </button>

            {/* ✅ NOU: Aici randăm sugestiile primite de la backend */}
            <div className="min-h-[100px] max-h-[250px] overflow-y-auto border border-dashed border-gray-300 rounded p-2 text-sm text-gray-500 bg-gray-50 flex flex-col gap-2">
                {!isListening && suggestedTitles.length === 0 && (
                    <div className="m-auto text-center">Apasă pornire pentru sugestii.</div>
                )}

                {isListening && suggestedTitles.length === 0 && (
                    <div className="m-auto text-center animate-pulse">Ascult emisia și aștept subiecte relevante...</div>
                )}

                {/* Lista cu titluri generate */}
                {suggestedTitles.map((title, index) => (
                    <div key={index} className="p-2 bg-white rounded shadow-sm border border-gray-100 flex items-center justify-between group">
                        <span className="font-bold text-black">{title}</span>
                        {/* Pe viitor, buton de 'Folosește' care adaugă titlul automat în CSV */}
                        <button
                            className="text-xs bg-gray-200 hover:bg-blue-500 hover:text-white px-2 py-1 rounded transition-colors"
                            onClick={() => navigator.clipboard.writeText(title)} // Exemplu simplu: Copiază în clipboard
                        >
                            Copiază
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}