import classNames from 'classnames'
import Card from '@/components/ui/Card'
import { useAppSelector } from '@/store/hook'
import type { CardProps } from '@/components/ui/Card'

interface AdaptableCardProps extends CardProps {
    leftSideBorder?: boolean
    rightSideBorder?: boolean
    divider?: boolean
    shadow?: boolean
    isLastChild?: boolean
}

const AdaptableCard = (props: AdaptableCardProps) => {
    const {
        className,
        children,
        bodyClass,
        leftSideBorder,
        rightSideBorder,
        divider,
        shadow,
        isLastChild,
        ...rest
    } = props

    return (
        <Card
            className={classNames(
                className,
                'border-0',
                rightSideBorder &&
                    'ltr:border-r-0 rtl:border-l-0 ltr:md:border-r rtl:md:border-l md:border-gray-200 md:dark:border-gray-600 rounded-tr-none rounded-br-none rtl:rounded-tr-none rtl:rounded-br-none',
                leftSideBorder &&
                    'ltr:border-l-0 rtl:border-r-0 ltr:md:border-l rtl:md:border-r md:border-gray-200 md:dark:border-gray-600 rounded-tl-none rounded-bl-none rtl:rounded-tl-none rtl:rounded-bl-none',
                divider &&
                    `${
                        !isLastChild ? 'border-b pb-6' : ''
                    } py-4 md:border-gray-200 md:dark:border-gray-600 rounded-br-none rounded-bl-none`,
                shadow && 'rounded-none shadow-none border-0'
            )}
            {...rest}
            bodyClass={classNames('card-gutterless', bodyClass)}
        >
            {children}
        </Card>
    )
}

export default AdaptableCard
