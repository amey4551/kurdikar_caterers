import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useState } from 'react'
import PrivacyAndPolicy from '@/components/template/footer/component/PrivacyAndPolicy'
import { useTranslation } from 'react-i18next'
import TermsAndConditions from '@/components/template/footer/component/TermsAndConditions'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [dialogTermIsOpen, setTermIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const openTermDialog = () => {
        setTermIsOpen(true)
    }

    const onDialogTermClose = () => {
        setTermIsOpen(false)
    }

    const { t } = useTranslation('footer')

    return (
        <>
            <TermsAndConditions
                dialogTermIsOpen={dialogTermIsOpen}
                onDialogTermClose={onDialogTermClose}
            />
            <PrivacyAndPolicy
                dialogIsOpen={dialogIsOpen}
                onDialogClose={onDialogClose}
            />

            <div className="flex items-center justify-between flex-auto w-full">
                <span>
                    {t('copyright')} &copy; {`${new Date().getFullYear()}`}{' '}
                    <span>{`${APP_NAME}`}</span>{' '}
                    {t('all_right_reserved')}
                </span>
                <div className="">
                    <span
                        className="text-gray cursor-pointer"
                        onClick={() => openTermDialog()}
                    >
                        {t('term_condition')}
                    </span>
                    <span className="mx-2 text-muted"> | </span>
                    <span
                        className="text-gray cursor-pointer"
                        onClick={() => openDialog()}
                    >
                        {t('privacy_policy')}
                    </span>
                </div>
            </div>
        </>
    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
