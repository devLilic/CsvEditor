// features/csv-editor/hooks/useCsvInitialization.ts

import { useEffect, useRef } from 'react'

import { csvService } from '../services/csvService'
import { parseCsv } from '../utils/csvParser'
import { useCsvContext } from '../context/CsvContext'
import { createDefaultProjectEntities } from '../domain/defaultProject'
import { defaultProjectSettingsService } from '../services/defaultProjectSettingsService'

/**
 * Hook responsabil exclusiv de initializarea CSV:
 * - incearca getLastCsv()
 * - fallback openCsvDialog()
 * - parse CSV
 * - dispatch CSV_LOADED
 *
 * NU autosave
 * NU UI logic
 * NU Electron direct
 */
export function useCsvInitialization() {
    const { dispatch, state } = useCsvContext()
    const hasInitializedRef = useRef(false)

    useEffect(() => {
        if (state.isLoaded) return
        if (hasInitializedRef.current) return

        hasInitializedRef.current = true

        ;(async () => {
            const last = await csvService.getLast()
            if (last?.content) {
                const entities = parseCsv(last.content)
                dispatch({
                    type: 'CSV_LOADED',
                    payload: entities,
                })
                return
            }

            const opened = await csvService.openDialog()
            if (opened?.content) {
                const entities = parseCsv(opened.content)
                dispatch({
                    type: 'CSV_LOADED',
                    payload: entities,
                })
                return
            }

            const defaultProjectSettings = await defaultProjectSettingsService.getDefaultProjectSettings()

            dispatch({
                type: 'CSV_LOADED',
                payload: createDefaultProjectEntities(defaultProjectSettings),
            })
        })()
    }, [dispatch, state.isLoaded])
}
