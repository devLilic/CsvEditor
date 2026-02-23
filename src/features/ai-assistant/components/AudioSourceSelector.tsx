// src/features/ai-assistant/components/AudioSourceSelector.tsx
import { useState, useEffect } from 'react'

interface AudioDevice {
    deviceId: string
    label: string
}

export function AudioSourceSelector({ onSelect }: { onSelect: (deviceId: string) => void }) {
    const [devices, setDevices] = useState<AudioDevice[]>([])
    const [selectedDevice, setSelectedDevice] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        let isMounted = true

        async function getDevices() {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true })
                const allDevices = await navigator.mediaDevices.enumerateDevices()

                const audioInputs = allDevices
                    .filter(device => device.kind === 'audioinput')
                    .map(device => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microfon necunoscut (${device.deviceId.slice(0, 5)}...)`
                    }))

                if (isMounted) {
                    setDevices(audioInputs)
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Eroare la accesarea dispozitivelor audio:", err)
                    setError("Nu am putut accesa microfonul.")
                }
            }
        }

        getDevices()
        return () => { isMounted = false }
    }, [])

    // ✅ Rezolvarea erorii: Folosim un useEffect separat pentru selecția inițială
    // Acest lucru asigură că onSelect este apelat DUPĂ ce randarea s-a terminat
    useEffect(() => {
        if (devices.length > 0 && selectedDevice === '') {
            const firstDevice = devices[0].deviceId
            setSelectedDevice(firstDevice)
            onSelect(firstDevice)
        }
    }, [devices, selectedDevice, onSelect])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDeviceId = e.target.value
        setSelectedDevice(newDeviceId)
        onSelect(newDeviceId)
    }

    if (error) {
        return <div className="text-red-500 text-xs p-2 bg-red-50 rounded border border-red-200">{error}</div>
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Sursă Audio Live</label>
            <select
                value={selectedDevice}
                onChange={handleChange}
                className="w-full p-1.5 text-xs border rounded bg-gray-50 text-gray-800 outline-none focus:border-blue-500"
            >
                {devices.length === 0 && <option disabled>Se caută surse...</option>}
                {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                    </option>
                ))}
            </select>
        </div>
    )
}