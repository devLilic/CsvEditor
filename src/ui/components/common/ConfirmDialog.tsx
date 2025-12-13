// src/ui/components/common/ConfirmDialog.tsx
import { ReactNode, useState } from 'react'

export function ConfirmDialog({
                                  title,
                                  description,
                                  onConfirm,
                                  children,
                              }: {
    title: string
    description?: string
    onConfirm: () => void
    children: ReactNode
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
      <span onClick={() => setOpen(true)}>
        {children}
      </span>

            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded p-4 w-80">
                        <h2 className="font-semibold mb-2">{title}</h2>
                        {description && (
                            <p className="text-sm text-gray-600 mb-4">
                                {description}
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setOpen(false)}>
                                Anulează
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm()
                                    setOpen(false)
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Confirmă
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
