import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import { useAppSelector } from '@/store/hook'

interface LogoProps extends CommonProps {
    imgClass?: string
    logoWidth?: number | string
    text?: string
    logoTooltip?: boolean
}

const Logo = (props: LogoProps) => {
    const {
        className,
        imgClass,
        style,
        logoWidth = 'auto',
        text = 'text-white',
        logoTooltip = false,
    } = props

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse
    )
    const direction = useAppSelector((state) => state.theme.direction)

    return (
        <div className="flex flex-col justify-center align-middle gap-2 text-center">
            <div
                className={classNames('logo', className)}
                style={{
                    ...style,
                    ...{ width: logoWidth },
                    margin: '1rem auto',
                }}
            >
                
            </div>
            {sideNavCollapse && logoTooltip ? (
                <div className="mb-4"></div>
            ) : (
                <span className={text}>school_name</span>
            )}
        </div>
    )
}

export default Logo
