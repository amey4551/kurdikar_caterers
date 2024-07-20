import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { useLocation } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import type { ComponentType } from 'react'
import { setCurrentRouteKey } from '@/store/slices/base/commonSlice'

export type AppRouteProps<T> = {
    component: ComponentType<T>
    routeKey: string
    layout?: LayoutType
}

const AppRoute = <T extends Record<string, unknown>>({
    component: Component,
    routeKey,
    ...props
}: AppRouteProps<T>) => {
    const location = useLocation()

    const dispatch = useAppDispatch()

    const handleLayoutChange = useCallback(() => {
        dispatch(setCurrentRouteKey(routeKey))
    }, [dispatch, props.layout, routeKey])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    return <Component {...(props as T)} />
}

export default AppRoute
