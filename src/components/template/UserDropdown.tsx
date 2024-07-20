import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiCheck, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import appConfig from '@/configs/app.config'
import { useMemo, useState } from 'react'
import i18n, { dateLocales } from '@/locales'
import { setLang } from '@/store/slices/locale'
import dayjs from 'dayjs'
import { Menu, Spinner } from '../ui'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = []

const languageList = [
    { label: 'English', value: 'en', flag: 'us' },
    { label: 'Arabic', value: 'ar', flag: 'ar' },
]

const _UserDropdown = ({ className }: CommonProps) => {
    const { name, email, avatar } = useAppSelector(
        (state) => state.auth.user
    )
    const { signOut } = useAuth()
    const { t } = useTranslation('menu')
    const profileUrl = avatar && appConfig.assetUrl + avatar
    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <Avatar
                size={32}
                shape="circle"
                icon={<HiOutlineUser />}
                src={profileUrl}
            />
            <div className="hidden md:block">
                <div className="font-bold">{name}</div>
            </div>
        </div>
    )
    const [loading, setLoading] = useState(false)
    const locale = useAppSelector((state) => state.locale.currentLang)
    const dispatch = useAppDispatch()

    const selectLangFlag = useMemo(() => {
        return languageList.find((lang) => lang.value === locale)
    }, [locale])

    const onLanguageSelect = (lang: string) => {
        const formattedLang = lang.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase()
        })

        setLoading(true)
        const dispatchLang = () => {
            i18n.changeLanguage(formattedLang)
            dispatch(setLang(lang))
            setLoading(false)
        }

        dateLocales[formattedLang]()
            .then(() => {
                dayjs.locale(formattedLang)
                dispatchLang()
            })
            .catch(() => {
                dispatchLang()
            })
    }

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar
                            shape="circle"
                            icon={<HiOutlineUser />}
                            src={profileUrl}
                        />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {name}
                            </div>
                            <div className="text-xs">{email}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{t(item.label)}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                {/* <Dropdown.Item variant="divider" /> */}
                <Menu>
                    <Menu.MenuCollapse
                        className="p-0"
                        eventKey="language"
                        label={
                            <div className={'flex items-center px-2'}>
                                {loading ? (
                                    <Spinner size={20} />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Avatar
                                            size={18}
                                            shape="circle"
                                            src={`/img/countries/${selectLangFlag?.flag}.png`}
                                        />
                                        <span>{selectLangFlag?.label}</span>
                                    </span>
                                )}
                            </div>
                        }
                    >
                        {languageList.map((lang) => (
                            <Menu.MenuItem
                                key={lang.label}
                                className="mb-1 justify-between"
                                eventKey={lang.label}
                                onSelect={() => onLanguageSelect(lang.value)}
                            >
                                <span className="flex items-center">
                                    <Avatar
                                        size={18}
                                        shape="circle"
                                        src={`/img/countries/${lang.flag}.png`}
                                    />
                                    <span className="ltr:ml-2 rtl:mr-2">
                                        {lang.label}
                                    </span>
                                </span>
                                {locale === lang.value && (
                                    <HiCheck className="text-emerald-500 text-lg" />
                                )}
                            </Menu.MenuItem>
                        ))}
                    </Menu.MenuCollapse>
                </Menu>

                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>{t('sign_out')}</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
