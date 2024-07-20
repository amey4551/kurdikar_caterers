import { forwardRef } from 'react'
import type { CommonProps } from '../@types/common'
import { Trans, useTranslation } from 'react-i18next'

export interface ErrorMessageProps extends CommonProps {
    messageId: string,
    data?: React.ReactElement[]
    value?: string
}

const ErrorMessage = forwardRef<HTMLElement, ErrorMessageProps>((props, ref) => {
    const {
        className,
        messageId,
        data,
        value,
        ...rest
    } = props
    const { t, ready } = useTranslation("error", { useSuspense: false })

    if (!ready) {
        return <></>
    }

    return (
        <span ref={ref} className={className} {...rest}>
            <Trans
                t={t}
                i18nKey={messageId}
                values={{ value }}
                components={data || { bold: <strong /> }}
            />
        </span>
    )
})

ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage


