import React, { useState, useEffect } from 'react'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import 'react-time-picker/dist/TimePicker.css'
import * as Yup from 'yup'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Card, Notification, toast } from '@/components/ui'
import { supabase } from '@/backend/supabaseClient'
import { FieldProps } from 'formik'
import FoodItem from './FoodItem'
import { FoodItemType, FormModel, Option } from '@/@types/createOrder.type'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const occasionOptions: Option[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'meeting', label: 'Meeting' },
]

const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string
) => {
    toast.push(
        <Notification
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
            width={500}
        >
            {title}
        </Notification>
    )
}

const validationSchema = Yup.object().shape({
    order_date: Yup.date().required('Date Required!').nullable(),
    order_time: Yup.string().required('Time Required!'),
    order_location: Yup.string()
        .min(3, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please input the location!'),
    client_name: Yup.string()
        .min(3, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please input the client name!'),
    people_count: Yup.number()
        .min(1, 'At least one person required!')
        .required('Please input the number of people!'),
    order_occasion: Yup.string().required('Please select an occasion!'),
})

const submitForm = async (
    values: FormModel,
    selectedItems: FoodItemType[],
    setSelectedItems: React.Dispatch<React.SetStateAction<FoodItemType[]>>,
    { setSubmitting, resetForm }: FormikHelpers<FormModel>,
    orderId: string,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const { error: orderError } = await supabase
            .from('order_datetime_details')
            .update({
                order_date: values.order_date,
                order_time: values.order_time,
                order_location: values.order_location,
                client_name: values.client_name,
                people_count: values.people_count,
                order_occasion: values.order_occasion,
            })
            .eq('id', orderId)

        if (orderError) throw orderError

        const { error: deleteError } = await supabase
            .from('order_food_items')
            .delete()
            .eq('order_id', orderId)

        if (deleteError) throw deleteError

        const foodItemsToInsert = selectedItems.map((item) => ({
            order_id: orderId,
            food_item_id: item.id,
            food_item_name: item.item_name,
        }))

        const { error: foodItemsError } = await supabase
            .from('order_food_items')
            .insert(foodItemsToInsert)

        if (foodItemsError) throw foodItemsError

        openNotification('success', 'Order updated successfully')
        setIsEditing(false)
    } catch (error) {
        openNotification(
            'danger',
            'An error occurred while updating the order. Please try again.'
        )
    } finally {
        setSubmitting(false)
    }
}

const FoodSelectionComponent = ({
    data,
    selectedItems,
    setSelectedItems,
    isEditing,
    setIsEditing,
}: any) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (data.order_food_items) {
            setIsEditing(data.order_food_items.length === 0)
        }
        setIsLoading(false)
    }, [data, setIsEditing])

    const handleEditClick = () => {
        setIsEditing(true)
    }

    return (
        <div>
            {!isLoading && isEditing ? (
                <FoodItem
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    initialItems={selectedItems}
                />
            ) : (
                <>
                    <ul className="pl-0 mb-6 grid grid-cols-3 gap-2">
                        {selectedItems.map((item: any, index: number) => (
                            <li
                                key={index}
                                className="p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                            >
                                <span className="text-gray-800 capitalize">
                                    {item.item_name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                    >
                        Edit Menu
                    </button>
                </>
            )}
        </div>
    )
}

const CustomForm: React.FC<any> = ({ data }) => {
    const [selectedItems, setSelectedItems] = useState<FoodItemType[]>([])
    const [isEditing, setIsEditing] = useState(true)
    const params = useParams<{ id: string }>()

    useEffect(() => {
        if (data && data.order_food_items) {
            const items = data.order_food_items.map(
                (item: any) => item.food_item_data
            )
            setSelectedItems(items)
            setIsEditing(false)
        }
    }, [data])

    const initialValues: FormModel = {
        order_date: data?.order_date ? new Date(data.order_date) : null,
        order_time: data?.order_time ? data.order_time.slice(0, 5) : '12:00',
        order_location: data?.order_location || '',
        client_name: data?.client_name || '',
        people_count: data?.people_count || 1,
        order_occasion: data?.order_occasion || '',
    }

    return (
        <div className="">
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) =>
                    submitForm(
                        values,
                        selectedItems,
                        setSelectedItems,
                        actions,
                        params.id!,
                        setIsEditing
                    )
                }
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="flex gap-6  ">
                        <div className="w-1/3 space-y-6">
                            <Card>
                                <h2 className="text-xl font-semibold mb-4">
                                    Order Date & Time
                                </h2>
                                <div className="space-y-6">
                                    <FormItem
                                        asterisk
                                        label="Order Date"
                                        invalid={
                                            errors.order_date &&
                                            touched.order_date
                                        }
                                        errorMessage={errors.order_date}
                                    >
                                        <Field name="order_date">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<Date | null>) => (
                                                <DatePicker
                                                    field={field}
                                                    form={form}
                                                    value={values.order_date}
                                                    onChange={(date) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            date
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Order Time"
                                        invalid={
                                            errors.order_time &&
                                            touched.order_time
                                        }
                                        errorMessage={errors.order_time}
                                    >
                                        <Flatpickr
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: 'h:i K',
                                                static: true,
                                                time_24hr: false,
                                            }}
                                            value={
                                                values.order_time ||
                                                dayjs().format('HH:mm')
                                            }
                                            onChange={(time: any) =>
                                                setFieldValue(
                                                    'order_time',
                                                    dayjs(time[0]).format(
                                                        'HH:mm'
                                                    )
                                                )
                                            }
                                            className="w-full h-11 px-5 font-semibold text-base tracking-widest rounded-md border border-gray-300"
                                        />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Order Location"
                                        invalid={
                                            errors.order_location &&
                                            touched.order_location
                                        }
                                        errorMessage={errors.order_location}
                                    >
                                        <Field
                                            type="text"
                                            name="order_location"
                                            placeholder="Location"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                            </Card>

                            <Card>
                                <h2 className="text-xl font-semibold mb-4">
                                    Client Details
                                </h2>
                                <div className="space-y-6">
                                    <FormItem
                                        asterisk
                                        label="Client Name"
                                        invalid={
                                            errors.client_name &&
                                            touched.client_name
                                        }
                                        errorMessage={errors.client_name}
                                    >
                                        <Field
                                            type="text"
                                            name="client_name"
                                            placeholder="Client Name"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Number of People"
                                        invalid={
                                            errors.people_count &&
                                            touched.people_count
                                        }
                                        errorMessage={errors.people_count}
                                    >
                                        <Field
                                            type="number"
                                            name="people_count"
                                            placeholder="Number of People"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Occasion"
                                        invalid={
                                            errors.order_occasion &&
                                            touched.order_occasion
                                        }
                                        errorMessage={errors.order_occasion}
                                    >
                                        <Field name="order_occasion">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<string>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={occasionOptions}
                                                    value={occasionOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            values.order_occasion
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </Card>
                        </div>

                        <div className="w-full">
                            <Card>
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl font-semibold mb-4">
                                        Food Items
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <Button
                                            className="mb-4"
                                            type="reset"
                                            onClick={() => {
                                                resetForm()
                                                setSelectedItems([])
                                                setIsEditing(true)
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button variant="solid" type="submit">
                                            {data
                                                ? 'Update Order'
                                                : 'Submit Order'}
                                        </Button>
                                    </div>
                                </div>
                                <FoodSelectionComponent
                                    data={data}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                />
                            </Card>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CustomForm
