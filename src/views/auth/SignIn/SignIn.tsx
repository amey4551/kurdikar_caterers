import React from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import SignInForm from './SignInForm'
import { Button } from '@/components/ui'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { setUser, signInSuccess, useAppDispatch } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import appConfig from '@/configs/app.config'

const SignIn = () => {
    const supabase = useSupabaseClient()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const query = useQuery()

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: 'https://www.googleapis.com/auth/calendar'
                }
            })
            if (error) throw error
        } catch (error) {
            console.error('Error signing in with Google:', error)
            alert('Problem logging in with Google')
        }
    }

    const handleAuthStateChange = async (event : any, session : any) => {
        if (event === 'SIGNED_IN' && session) {
            const { user, access_token } = session

            dispatch(signInSuccess(access_token))
            dispatch(setUser({
                userName: user.email,
                email: user.email,
                avatar: user.user_metadata.avatar_url || '',
                authority: ['USER'],
            }))

            const redirectUrl = query.get('redirect_url') || appConfig.authenticatedEntryPath
            navigate(redirectUrl)
        }
    }

    React.useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange)

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
                <h3 className="mb-1">Welcome back!</h3>
                <p>Please enter your credentials to sign in!</p>
            </div>
            <SignInForm disableSubmit={false} />
            <div className="mt-4 text-center">
                <p className="mb-2">Or sign in with</p>
                <Button 
                    variant="plain" 
                    onClick={signInWithGoogle}
                    icon={<FcGoogle className="text-xl" />}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}

export default SignIn