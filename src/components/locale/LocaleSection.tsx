import React from 'react'
import { Segment } from '../ui'
import { useAppDispatch } from '@/store'
import { SegmentValue } from '../ui/Segment/context'
import SegmentItem from '../ui/Segment/SegmentItem'
import { useAppSelector } from '@/store/hook'
import { setLang } from '@/store/slices/locale'

function LocaleSection() {
    const lang = useAppSelector((state) => state.locale.currentLang)
    const dispatch = useAppDispatch()

    const onChange = (segmentValue: SegmentValue) => {
        dispatch(setLang(segmentValue))
    }

    return (
        <Segment
            selectionType="single"
            defaultValue={lang}
            size="xs"
            onChange={onChange}
        >
            <SegmentItem value="en">English</SegmentItem>
            <SegmentItem value="ar">عربي</SegmentItem>
        </Segment>
    )
}

export default LocaleSection
