import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'orderDetails',
        path: '/orderDetails/:id',
        component: lazy(() => import('@/views/manageOrders/ManageOrders')),
        authority: [],
    },
    {
        key: 'nameTag',
        path: '/name_tag',
        component: lazy(() => import('@/views/nameTags/index')),
        authority: [],
    },
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@/views/invoice/Invoice')),
        authority: [],
    },
    {
        key: 'main',
        path: '/main',
        component: lazy(() => import('@/views/events/Events')),
        authority: [],
    },
    {
        key: 'addFoodItemNew',
        path: '/add_food_item',
        component: lazy(() => import('@/views/AddFoodItemNew/AddFoodItemNew')),
        authority: [],
    },
]