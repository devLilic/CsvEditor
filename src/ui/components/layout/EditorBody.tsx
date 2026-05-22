// src/ui/components/layout/EditorBody.tsx
import { EntityList } from '../EntityList'
import { EntityEditor } from '../EntityEditor'
import { EntityTypeTabsLeft } from '../EntityTypeTabsLeft'

export function EditorBody() {
    return (
        <div className="flex-1 grid grid-cols-[minmax(0,700px)_minmax(0,1fr)] gap-4 p-4 min-h-0 min-w-0 overflow-hidden">
            {/* LEFT */}
            <div className="bg-white rounded border p-3 flex flex-col min-h-0 min-w-0">
                <div className="pb-3 border-b">
                    <EntityTypeTabsLeft />
                </div>

                {/* IMPORTANT: min-h-0 + flex-1 ca să permită scroll intern */}
                <div className="pt-3 flex-1 min-h-0 min-w-0">
                    <EntityList />
                </div>
            </div>

            {/* RIGHT */}
            <div className="min-h-0 min-w-0 overflow-hidden">
                <EntityEditor />
            </div>
        </div>
    )
}
