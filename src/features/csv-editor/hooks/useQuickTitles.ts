// features/csv-editor/hooks/useQuickTitles.ts

import { useEffect, useState, useCallback, useRef } from 'react'
import { settingsService } from '../services/settingsService'

/**
 * Hook pentru QuickTitles
 * - load la mount
 * - persist explicit
 * - fără context global
 * - fără Electron direct
 */
export function useQuickTitles() {
    const [quickTitles, setQuickTitles] = useState<string[]>([])
    const isLoadedRef = useRef(false)

    // ---- LOAD INITIAL ----
    useEffect(() => {
        ;(async () => {
            const list = await settingsService.getQuickTitles()
            setQuickTitles(list)
            isLoadedRef.current = true
        })()
    }, [])

    // ---- ADD ----
    const addQuickTitle = useCallback(
        async (title: string) => {
            const trimmed = title.trim()
            if (!trimmed) return

            const next = [...quickTitles, trimmed]
            setQuickTitles(next)

            await settingsService.setQuickTitles(next)
        },
        [quickTitles]
    )

    // ---- REMOVE ----
    const removeQuickTitle = useCallback(
        async (title: string) => {
            const next = quickTitles.filter((t) => t !== title)
            setQuickTitles(next)

            await settingsService.setQuickTitles(next)
        },
        [quickTitles]
    )

    // ---- REPLACE ALL (OPTIONAL, util pentru Settings UI) ----
    const setAllQuickTitles = useCallback(
        async (titles: string[]) => {
            setQuickTitles(titles)
            await settingsService.setQuickTitles(titles)
        },
        []
    )

    return {
        quickTitles,
        isLoaded: isLoadedRef.current,
        addQuickTitle,
        removeQuickTitle,
        setAllQuickTitles,
    }
}
