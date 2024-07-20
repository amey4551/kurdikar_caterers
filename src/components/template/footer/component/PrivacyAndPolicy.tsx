import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Trans, useTranslation } from 'react-i18next'

type privacy = {
    dialogIsOpen: boolean
    onDialogClose: () => void
}
const PrivacyAndPolicy = ({ dialogIsOpen, onDialogClose }: privacy) => {
    const { t } = useTranslation('footer')

    return (
        <Dialog
            isOpen={dialogIsOpen}
            closable={false}
            width={1000}
            height={550}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <div className="flex flex-col h-full justify-between">
                <div className="max-h[20rem] overflow-y-auto px-4">
                    <Trans
                        i18nKey={t('privacy_and_policy', { joinArrays: ' ' })}
                        components={{
                            h2: <h2 />,
                            li: <li />,
                            p: <p />,
                            h4: <h4 />,
                            br: <br />,
                            strong: <strong />,
                            ol: <ol className="list-decimal list-inside" />,
                            a: <a className="text-blue-500 hover:underline" />,
                            ul: <ul className="list-disc list-inside" />,
                            h3: <h3 />,
                        }}
                    />
                </div>
                <div className="text-right">
                    <Button variant="solid" onClick={onDialogClose}>
                        {t('close')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
export default PrivacyAndPolicy
