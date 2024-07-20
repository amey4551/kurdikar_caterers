import { lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Side from './Side'
import View from '@/views'

const AuthLayout = () => {
    const location = useLocation()

    const blankLayout =
        location.pathname.includes('/consent/') ||
        location.pathname.includes('/access-denied')

    return (
        <>
            {blankLayout ? (
                <View />
            ) : (
                <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
                    <Side>
                        <View />
                    </Side>
                </div>
            )}
        </>
    )
}

export default AuthLayout
