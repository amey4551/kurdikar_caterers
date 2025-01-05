
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import CreateDraftForm from './CreateDraftForm'

const CreateDraft = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const screenWidth = window.innerWidth;
console.log('Screen width:', screenWidth);


    return (
        <div>
            <Button variant="solid" size="sm" onClick={() => openDialog()}>
            Schedule Order
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={screenWidth}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Schedule order</h5>
                    <CreateDraftForm onDialogClose={onDialogClose}/>
                </div>
            </Dialog>
        </div>
    )
}

export default CreateDraft

