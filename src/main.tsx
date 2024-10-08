/* eslint-disable import/default */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {SessionContextProvider} from '@supabase/auth-helpers-react'
import { supabase } from './backend/supabaseClient'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <SessionContextProvider supabaseClient={supabase}>
        <App />
        </SessionContextProvider>
    </React.StrictMode>
)
