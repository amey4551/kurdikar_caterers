import { useMemo, lazy, Suspense, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import useAuth from '@/utils/hooks/useAuth'
import useLocale from '@/utils/hooks/useLocale'

const modernLayout = lazy(() => import('./ModernLayout'))

const Layout = () => {
    const { authenticated } = useAuth()

    useLocale()

    const AppLayout = useMemo(() => {
        if (authenticated) {
            return modernLayout
        }
        return lazy(() => import('./AuthLayout'))
    }, [authenticated])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            <AppLayout />
        </Suspense>
    )
}

export default Layout
