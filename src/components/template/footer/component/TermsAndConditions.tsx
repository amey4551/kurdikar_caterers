import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Trans, useTranslation } from 'react-i18next'

type terms = {
    dialogTermIsOpen: boolean
    onDialogTermClose: () => void
}
const TermsAndConditions = ({ dialogTermIsOpen, onDialogTermClose }: terms) => {
    const { t } = useTranslation('footer')

    return (
        <Dialog
            isOpen={dialogTermIsOpen}
            closable={false}
            width={1000}
            height={550}
            onClose={onDialogTermClose}
            onRequestClose={onDialogTermClose}
        >
            <div className="flex flex-col h-full justify-between">
                <div className="max-h[20rem] overflow-y-auto px-4">
                    <Trans
                        i18nKey={t('terms_conditions', { joinArrays: ' ' })}
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
                    <Button variant="solid" onClick={onDialogTermClose}>
                        {t('close')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
export default TermsAndConditions
