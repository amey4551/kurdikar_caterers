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
    userName: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Please enter your user name'),
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
        const { userName, password } = values
        setSubmitting(true)

        try {
            const { data: { session }, error } = await supabase.auth.signInWithPassword({
                email: userName,
                password,
            })

            if (error) {
                throw error
            }

            if (session) {
                const token = session.access_token

                if (token) {
                    dispatch(signInSuccess(token))
                    dispatch(
                        setUser({
                            userName: userName,
                            email: userName, // Assuming email is same as userName here; adjust if needed
                            avatar: '', // Set this if you have user avatar URL
                            authority: ['USER'],
                        })
                    )
                }

                const redirectUrl = query.get('redirect_url') || appConfig.authenticatedEntryPath
                navigate(redirectUrl)
                setMessage('Sign-in successful!')
            }
        } catch (error: any) {
            setMessage(error.message || 'An error occurred')
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
                    userName: '',
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
                                label="User Name"
                                invalid={errors.userName && touched.userName}
                                errorMessage={errors.userName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="userName"
                                    placeholder="User Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
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
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
