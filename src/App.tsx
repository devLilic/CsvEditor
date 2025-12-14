// src/App.tsx

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {CsvEditorPage} from '@/ui/pages/CsvEditorPage'
import TemplateEditorPage from '@/ui/pages/TemplateEditorPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/csv-editor" replace/>}/>

                <Route path="/csv-editor" element={<CsvEditorPage/>}/>

                <Route
                    path="/template-editor"
                    element={<TemplateEditorPage/>}
                />
            </Routes>
        </BrowserRouter>
    )
}
