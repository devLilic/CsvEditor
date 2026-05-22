// src/ui/components/AppMenuNavigationListener.tsx

import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export function AppMenuNavigationListener() {
    const navigate = useNavigate()

    useEffect(() => {
        return window.electronAPI.onMenuNavigate((route) => {
            if (route === '/settings/default-project') {
                navigate(route)
            }
        })
    }, [navigate])

    return null
}
