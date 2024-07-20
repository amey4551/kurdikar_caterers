import { forwardRef } from 'react'
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from './context'
import { useConfig } from '../ConfigProvider'
import { CONTROL_SIZES, LAYOUT } from '../utils/constants'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode } from 'react'
import { LuHelpCircle } from 'react-icons/lu'
import Tooltip from '@/components/ui/Tooltip'

export interface FormItemProps extends CommonProps {
    asterisk?: boolean
    errorMessage?: string
    extra?: string | ReactNode
    htmlFor?: string
    invalid?: boolean | ''
    label?: string
    labelClass?: string
    labelWidth?: string | number
    layout?: TypeAttributes.FormLayout
    size?: TypeAttributes.ControlSize
    help?: string
    icon?: JSX.Element
}

const CustomField = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
    const {
        asterisk,
        children,
        className,
        errorMessage,
        extra,
        htmlFor,
        invalid,
        label,
        labelClass,
        labelWidth,
        layout,
        style,
        size,
        help,
        icon,
    } = props

    const formContext = useForm()
    const { controlSize } = useConfig()

    const formItemLabelHeight = size || formContext?.size || controlSize
    const formItemLabelWidth = labelWidth || formContext?.labelWidth
    const formItemLayout = layout || formContext?.layout

    const getFormLabelLayoutClass = () => {
        switch (formItemLayout) {
            case LAYOUT.HORIZONTAL:
                return label
                    ? `h-${CONTROL_SIZES[formItemLabelHeight]} ${
                          label && 'ltr:pr-1 rtl:pl-1'
                      }`
                    : 'ltr:pr-1 rtl:pl-1'
            case LAYOUT.VERTICAL:
                return `mb-1 mt-1`
            case LAYOUT.INLINE:
                return `h-${CONTROL_SIZES[formItemLabelHeight]} ${
                    label && 'ltr:pr-1 rtl:pl-1'
                }`
            default:
                break
        }
    }
    const formItemClass = classNames(
        'form-item',
        formItemLayout,
        className,
        invalid ? 'invalid' : ''
    )

    const formLabelClass = classNames(
        'form-label flex justify-between !text-[.85rem] font-medium pr-2 pl-1 pe-2 ps-1 items-center',
        label && getFormLabelLayoutClass(),
        labelClass
    )

    const formLabelStyle = () => {
        if (formItemLayout === LAYOUT.HORIZONTAL) {
            return { ...style, ...{ minWidth: formItemLabelWidth } }
        }

        return { ...style }
    }

    const enterStyle = { opacity: 1, marginTop: 1, bottom: -18 }
    const exitStyle = { opacity: 0, marginTop: -10 }
    const initialStyle = exitStyle

    return (
        <div ref={ref} className={formItemClass}>
            <label
                htmlFor={htmlFor}
                className={formLabelClass}
                style={formLabelStyle()}
            >
                <div className="flex items-center gap-1">
                    {icon && <p className="mr-[.1rem] text-[.95rem]">{icon}</p>}
                    <div>
                        {label}
                        {extra && <span>{extra}</span>}

                        {label && formItemLayout !== 'vertical' && ':'}
                        {asterisk && (
                            <span className="text-red-500 ltr:mr-1 rtl:ml-1">
                                *
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    {help ? (
                        <Tooltip title={help}>
                            <LuHelpCircle color="rgb(79, 70, 229)" />
                        </Tooltip>
                    ) : null}
                </div>
            </label>
            <div
                className={`${
                    formItemLayout === LAYOUT.HORIZONTAL
                        ? 'w-full flex flex-col justify-center relative'
                        : ''
                } ${invalid && 'mb-3'}`}
            >
                {children}
                <AnimatePresence mode="wait">
                    {invalid && (
                        <motion.div
                            className="form-explain text-[.75rem]"
                            initial={initialStyle}
                            animate={enterStyle}
                            exit={exitStyle}
                            transition={{ duration: 0.15, type: 'tween' }}
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
})

CustomField.displayName = 'CustomField'

export default CustomField
