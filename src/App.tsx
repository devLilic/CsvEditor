// src/App.tsx

import {HashRouter, Routes, Route, Navigate} from 'react-router-dom'
import {CsvEditorPage} from '@/ui/pages/CsvEditorPage'

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/csv-editor" replace/>}/>

                <Route path="/csv-editor" element={<CsvEditorPage/>}/>

                {/* TemplateEditor is intentionally not exposed in routing during the static-template cycle. */}
            </Routes>
        </HashRouter>
    )
}
