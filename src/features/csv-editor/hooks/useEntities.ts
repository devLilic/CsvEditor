// src/features/csv-editor/hooks/useEntities.ts
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType, CsvSection, SimpleTitle, Person, Location, SectionRow } from '../domain/entities'
import type { SelectedEntity } from '../domain/csv.types'
import { csvService } from '../services/csvService'
import { settingsService } from '../services/settingsService'
import { parseCsv } from '../utils/csvParser'
import { serializeCsv } from '../utils/csvSerializer'
import { createInvitedSection } from '../domain/entities'

type BlockItem =
    | { entityType: 'titles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'persons'; id: string; rowId: string; data: Person }
    | { entityType: 'locations'; id: string; rowId: string; data: Location }
    | { entityType: 'hotTitles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'waitTitles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'waitLocations'; id: string; rowId: string; data: Location }

function rowsToBlockItems(section: CsvSection, entityType: EntityType): BlockItem[] {
    const out: BlockItem[] = []

    for (const r of section.rows) {
        if (entityType === 'titles' && r.title) out.push({ entityType: 'titles', id: r.title.id, rowId: r.id, data: r.title })
        if (entityType === 'persons' && r.person) out.push({ entityType: 'persons', id: r.person.id, rowId: r.id, data: r.person })
        if (entityType === 'locations' && r.location) out.push({ entityType: 'locations', id: r.location.id, rowId: r.id, data: r.location })
        if (entityType === 'hotTitles' && r.hotTitle) out.push({ entityType: 'hotTitles', id: r.hotTitle.id, rowId: r.id, data: r.hotTitle })
        if (entityType === 'waitTitles' && section.kind === 'invited' && r.waitTitle) out.push({ entityType: 'waitTitles', id: r.waitTitle.id, rowId: r.id, data: r.waitTitle })
        if (entityType === 'waitLocations' && section.kind === 'invited' && r.waitLocation) out.push({ entityType: 'waitLocations', id: r.waitLocation.id, rowId: r.id, data: r.waitLocation })
    }

    return out
}

export function useEntities() {
    const { state, dispatch } = useCsvContext()

    const sections = state.entities.sections

    const getSectionById = useCallback(
        (sectionId: string) => sections.find((s) => s.id === sectionId) ?? null,
        [sections]
    )

    const activeSectionId = state.activeSectionId
    const activeSection = useMemo(
        () => (activeSectionId ? sections.find((s) => s.id === activeSectionId) ?? null : sections[0] ?? null),
        [activeSectionId, sections]
    )

    // -------- Sections ops --------
    const setActiveSection = useCallback(
        (sectionId: string) => dispatch({ type: 'SECTION_SET_ACTIVE', payload: { sectionId } }),
        [dispatch]
    )

    const addBetaSection = useCallback(
        (betaTitle: string) => dispatch({ type: 'SECTION_ADD_BETA', payload: { betaTitle } }),
        [dispatch]
    )

    const renameBetaSection = useCallback(
        (sectionId: string, betaTitle: string) =>
            dispatch({ type: 'SECTION_RENAME_BETA', payload: { sectionId, betaTitle } }),
        [dispatch]
    )

    const deleteBetaSection = useCallback(
        (sectionId: string) => dispatch({ type: 'SECTION_DELETE_BETA', payload: { sectionId } }),
        [dispatch]
    )

    // -------- READ block items --------
    const getBlockItems = useCallback(
        (sectionId: string, entityType: EntityType): BlockItem[] => {
            const s = sections.find((x) => x.id === sectionId)
            if (!s) return []
            return rowsToBlockItems(s, entityType)
        },
        [sections]
    )

    // -------- SELECT --------
    const selected = state.selected

    const setSelected = useCallback(
        (sel: SelectedEntity | null) => dispatch({ type: 'SET_SELECTED', payload: sel }),
        [dispatch]
    )

    // -------- CREATE --------
    const addEntity = useCallback(
        (sectionId: string, entityType: EntityType, data: Record<string, unknown>) => {
            dispatch({ type: 'ENTITY_ADD', payload: { sectionId, entityType, data } })
        },
        [dispatch]
    )

    // -------- UPDATE --------
    const updateEntity = useCallback(
        (sectionId: string, entityType: EntityType, id: string, data: Record<string, unknown>) => {
            dispatch({ type: 'ENTITY_UPDATE', payload: { sectionId, entityType, id, data } })
        },
        [dispatch]
    )

    // -------- DELETE --------
    const deleteEntity = useCallback(
        (sectionId: string, entityType: EntityType, id: string) => {
            dispatch({ type: 'ENTITY_DELETE', payload: { sectionId, entityType, id } })
        },
        [dispatch]
    )

    // -------- CLEAR ALL (CANONICAL) --------
    /**
     * Clear all should:
     * 1) backup CSV (safe)
     * 2) reset entities -> only INVITATI section empty
     * 3) clear quickTitles (persisted)
     * 4) write empty CSV (so disk matches state)
     */
    const clearAll = useCallback(async () => {
        // 1) backup current CSV
        const currentCsv = serializeCsv(state.entities)
        const backupRes = await csvService.backup(currentCsv)
        if (!backupRes.ok) {
            console.error('Backup failed:', backupRes.error)
        }

        // 2) build empty entities: only INVITATI
        const invitedId = uuidv4()
        const nextEntities = {
            sections: [createInvitedSection(invitedId, [])],
        }

        // 3) clear quickTitles in settings
        try {
            await settingsService.setQuickTitles([])
        } catch (e) {
            console.error('Failed to clear quickTitles:', e)
        }

        // 4) reset reducer state
        dispatch({ type: 'ENTITY_CLEAR_ALL', payload: nextEntities })

        // 5) write empty CSV
        const emptyCsv = serializeCsv(nextEntities)
        const writeRes = await csvService.write(emptyCsv)
        if (!writeRes.ok) {
            console.error('Failed to write empty CSV:', writeRes.error)
        }
    }, [dispatch, state.entities])

    // -------- LOAD CSV --------
    const loadCsv = useCallback(async () => {
        const opened = await csvService.openDialog()
        if (opened?.content) {
            const entities = parseCsv(opened.content)
            dispatch({ type: 'CSV_LOADED', payload: entities })
        }
    }, [dispatch])

    return {
        // state
        sections,
        activeSectionId,
        activeSection,
        activeEntityType: state.activeEntityType,
        selected,

        // section ops
        getSectionById,
        setActiveSection,
        addBetaSection,
        renameBetaSection,
        deleteBetaSection,

        // entities ops
        getBlockItems,
        setSelected,
        addEntity,
        updateEntity,
        deleteEntity,

        // global ops
        clearAll,

        // IO
        loadCsv,
    }
}