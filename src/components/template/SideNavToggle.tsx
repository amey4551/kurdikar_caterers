import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useAppDispatch } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import NavToggle from '@/components/shared/NavToggle'
import type { CommonProps } from '@/@types/common'
import { useAppSelector } from '@/store/hook'
import { setSideNavCollapse } from '@/store/slices/theme/themeSlice'

const _SideNavToggle = ({ className }: CommonProps) => {
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse
    )
    const dispatch = useAppDispatch()
    const { larger } = useResponsive()

    const onCollapse = () => {
        dispatch(setSideNavCollapse(!sideNavCollapse))
    }

    return (
        <>
            {larger.md && (
                <div className={className} onClick={onCollapse}>
                    <NavToggle className="text-2xl" toggled={sideNavCollapse} />
                </div>
            )}
        </>
    )
}

const SideNavToggle = withHeaderItem(_SideNavToggle)

export default SideNavToggle
