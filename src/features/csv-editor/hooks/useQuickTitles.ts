// src/features/csv-editor/hooks/useQuickTitles.ts
import { useEffect, useState, useCallback, useRef } from 'react'
import { settingsService } from '../services/settingsService'

/**
 * Hook pentru QuickTitles
 * - load la mount
 * - se sincronizează prin settingsService pub/sub
 * - fără Electron direct
 */
export function useQuickTitles() {
    const [quickTitles, setQuickTitles] = useState<string[]>([])
    const isLoadedRef = useRef(false)

    // ---- LOAD INITIAL + SUBSCRIBE ----
    useEffect(() => {
        const unsubscribe = settingsService.subscribeQuickTitles((titles) => {
                setQuickTitles(titles)
            })

        ;(async () => {
            const list = await settingsService.getQuickTitles()
            setQuickTitles(list)
            isLoadedRef.current = true
        })()

        return () => {
            unsubscribe()
        }
    }, [])

    // ---- ADD ----
    const addQuickTitle = useCallback(async (title: string) => {
        const trimmed = title.trim()
        if (!trimmed) return

        // evită duplicate simple
        setQuickTitles((prev) => {
            const next = [...prev, trimmed]
            // persist async (nu blocăm UI)
            settingsService.setQuickTitles(next).catch((e) =>
                console.error('Failed to persist quickTitles (add):', e)
            )
            return next
        })
    }, [])

    // ---- REMOVE ----
    const removeQuickTitle = useCallback(async (title: string) => {
        setQuickTitles((prev) => {
            const next = prev.filter((t) => t !== title)
            settingsService.setQuickTitles(next).catch((e) =>
                console.error('Failed to persist quickTitles (remove):', e)
            )
            return next
        })
    }, [])

    // ---- REPLACE ALL ----
    const setAllQuickTitles = useCallback(async (titles: string[]) => {
        const safe = Array.isArray(titles) ? titles : []
        setQuickTitles(safe)
        await settingsService.setQuickTitles(safe)
    }, [])

    // ---- CLEAR ----
    const clearQuickTitles = useCallback(async () => {
        setQuickTitles([])
        await settingsService.setQuickTitles([])
    }, [])

    // ---- RELOAD (din storage) ----
    const reloadQuickTitles = useCallback(async () => {
        const list = await settingsService.getQuickTitles()
        setQuickTitles(list)
    }, [])

    return {
        quickTitles,
        isLoaded: isLoadedRef.current,

        addQuickTitle,
        removeQuickTitle,
        setAllQuickTitles,

        // 🆕
        clearQuickTitles,
        reloadQuickTitles,
    }
}