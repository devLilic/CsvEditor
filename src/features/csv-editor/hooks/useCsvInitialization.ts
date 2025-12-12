// features/csv-editor/hooks/useCsvInitialization.ts

import { useEffect, useRef } from 'react'

import { csvService } from '../services/csvService'
import { parseCsv } from '../utils/csvParser'
import { useCsvContext } from '../context/CsvContext'

/**
 * Hook responsabil exclusiv de inițializarea CSV:
 * - încearcă getLastCsv()
 * - fallback openCsvDialog()
 * - parse CSV
 * - dispatch CSV_LOADED
 *
 * ❌ NU autosave
 * ❌ NU UI logic
 * ❌ NU Electron direct
 */
export function useCsvInitialization() {
    const { dispatch, state } = useCsvContext()
    const hasInitializedRef = useRef(false)

    useEffect(() => {
        if (state.isLoaded) return
        if (hasInitializedRef.current) return

        hasInitializedRef.current = true

        ;(async () => {
            // 1️⃣ încearcă să încarce ultimul CSV
            const last = await csvService.getLast()
            if (last?.content) {
                const entities = parseCsv(last.content)
                dispatch({
                    type: 'CSV_LOADED',
                    payload: entities,
                })
                return
            }

            // 2️⃣ fallback: dialog manual
            const opened = await csvService.openDialog()
            if (opened?.content) {
                const entities = parseCsv(opened.content)
                dispatch({
                    type: 'CSV_LOADED',
                    payload: entities,
                })
                return
            }

            // 3️⃣ nimic ales → aplicația rămâne loaded cu state gol
            dispatch({
                type: 'CSV_LOADED',
                payload: state.entities,
            })
        })()
    }, [dispatch, state.isLoaded, state.entities])
}
