// src/ui/components/Preview16x9.tsx
import type { ReactNode } from 'react'
import type { EntityType } from '@/features/csv-editor'

interface PreviewProps {
    content: ReactNode
    entityType: EntityType
}

/**
 * Preview-ul afișează EXACT structura finală de broadcast.
 * Nu modifică text, nu normalizează string-uri.
 * Primește JSX gata formatat.
 */
export function Preview16x9({
                                content,
                                entityType,
                            }: PreviewProps) {
    return (
        <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
      <span className="absolute top-2 left-2 text-xs text-white opacity-60">
        PREVIEW – {entityType.toUpperCase()}
      </span>

            <div className="w-full px-6 text-white">
                {content ?? (
                    <span className="opacity-40">
            Preview
          </span>
                )}
            </div>
        </div>
    )
}
