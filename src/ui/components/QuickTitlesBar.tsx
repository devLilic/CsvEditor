// src/ui/components/QuickTitlesBar.tsx
import { useRef } from 'react'
import { useQuickTitles } from '@/features/csv-editor'

interface QuickTitlesBarProps {
    onApplyPrefix: (prefix: string) => void
    focusEditor: () => void
}

export function QuickTitlesBar({
                                   onApplyPrefix,
                                   focusEditor,
                               }: QuickTitlesBarProps) {
    const {
        quickTitles,
        addQuickTitle,
        removeQuickTitle,
    } = useQuickTitles()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleCreate = async () => {
        const value = inputRef.current?.value ?? ''
        if (!value.trim()) return

        await addQuickTitle(value)
        inputRef.current!.value = ''
    }

    return (
        <div className="flex justify-between items-start items-center gap-2 flex-wrap bg-gray-50 p-2 rounded">
        <div className="flex gap-2">
            {/* QuickTitle buttons */}
            {quickTitles.map((qt) => (
                <button
                    key={qt}
                    onClick={() => {
                        onApplyPrefix(qt)
                        focusEditor()
                    }}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                    {qt.toUpperCase()}
                </button>
            ))}
        </div>


            {/* Add new quick title */}
            <input
                ref={inputRef}
                placeholder="Adaugă prefix nou..."
                className="border border-gray-500 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCreate()
                    }
                }}
            />
        </div>
    )
}
