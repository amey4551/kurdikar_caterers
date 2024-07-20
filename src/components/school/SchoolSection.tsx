import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import Select from '@/components/ui/Select'
import { setSchoolId } from '@/store/slices/school/schoolIdSlice'

const SchoolSection: React.FC<{}> = () => {
    const { school_list } = useAppSelector((state) => state.school)
    const { school_id } = useAppSelector((state) => state.school_id)

    const dispatch = useAppDispatch()

    return (
        <Select
            size="sm"
            className="mb-4"
            options={school_list?.map((schoolId) => {
                return {
                    value: schoolId,
                    label: schoolId,
                }
            })}
            defaultValue={{
                value: school_id,
                label: school_id,
            }}
            placeholder="Please Select School"
            onChange={(selection) => {
                dispatch(setSchoolId(selection?.value || ''))
            }}
        />
    )
}

export default SchoolSection
