import { cloneElement } from 'react'
import Logo from '@/components/template/Logo'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import LocaleSection from '@/components/locale/LocaleSection'
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
import { schoolTextType } from '@/@types/school'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const { t } = useTranslation()

    const { school_text } = useAppSelector((state) => state.school)

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
                    >
                        {school_text &&
                            Array.isArray(school_text) &&
                            school_text.map((data: schoolTextType) => (
                                <SwiperSlide
                                    key={data.sims_admission_preface_srno}
                                    className="flex items-center justify-center text-white pt-12"
                                >
                                    {data.sims_admission_preface_text}
                                </SwiperSlide>
                            ))}

                        {!Array.isArray(school_text) && (
                            <SwiperSlide className="flex items-center justify-center mt-10 text-white">
                                <div className="text-center">
                                    <ErrorMessage messageId={'L022'} />
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
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
