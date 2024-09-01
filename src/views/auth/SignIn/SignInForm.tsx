import React from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/backend/supabaseClient'
import { setUser, signInSuccess, useAppDispatch } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import appConfig from '@/configs/app.config'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    email: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { email, password } = values
        setSubmitting(true)

        try {
            const { data: { session }, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            if (session) {
                const { user, access_token } = session

                dispatch(signInSuccess(access_token))
                dispatch(setUser({
                    userName: user.email,
                    email: user.email,
                    avatar: user.user_metadata.avatar_url || '',
                    authority: ['USER'], // Adjust based on your user roles logic
                }))

                const redirectUrl = query.get('redirect_url') || appConfig.authenticatedEntryPath
                navigate(redirectUrl)
            }
        } catch (error: any) {
            setMessage(error.message || 'An error occurred during sign in')
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="current-password"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{`Don't have an account yet? `}</span>
                                <ActionLink to={signUpUrl}>Sign up</ActionLink>
                            </div>
                            <div className="mt-2 text-center">
                                <ActionLink to={forgotPasswordUrl}>Forgot Password?</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm