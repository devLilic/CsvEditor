// src/ui/components/layout/EditorBody.tsx
import { EntityList } from '../EntityList'
import { EntityEditor } from '../EntityEditor'

export function EditorBody() {
    return (
        <div className="flex-1 grid grid-cols-[600px_1fr] gap-4 p-4">
            <EntityList />
            <EntityEditor />
        </div>
    )
}
