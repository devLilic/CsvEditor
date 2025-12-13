// src/ui/context/EditModeContext.tsx
import { createContext, useContext, useState } from 'react'

interface EditModeContextValue {
    editMode: boolean
    toggleEditMode: () => void
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

export function EditModeProvider({ children }: { children: React.ReactNode }) {
    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode((v) => !v)
    }

    return (
        <EditModeContext.Provider value={{ editMode, toggleEditMode }}>
            {children}
        </EditModeContext.Provider>
    )
}

export function useEditMode() {
    const ctx = useContext(EditModeContext)
    if (!ctx) {
        throw new Error('useEditMode must be used inside EditModeProvider')
    }
    return ctx
}
