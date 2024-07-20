import { cloneElement } from 'react'
import Logo from '@/components/template/Logo'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

// import required modules
import { Autoplay, Pagination } from 'swiper/modules'
import ErrorMessage from '@/components/ui/Locale/ErrorMessage'
import { useAppSelector } from '@/store'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const { t } = useTranslation()

    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/mograsys-side-panel.png')`,
                }}
            >
                <Logo />
                <div className="w-full h-full min-w-full mb-8">
                    <Swiper
                        pagination={{
                            clickable: true,
                        }}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        modules={[Pagination, Autoplay]}
                        className="w-full h-full min-w-full"
                    ></Swiper>
                </div>
                <p className="text-white">{t('copyright')}</p>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
