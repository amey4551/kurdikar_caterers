import React, { useState } from 'react'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { supabase } from '@/backend/supabaseClient'
import { IoIosArrowDown } from 'react-icons/io'
import { Dialog, Notification, toast } from '@/components/ui'
import * as Yup from 'yup'
import chaffingDishImg from '../../assets/dishes/chaffingDish.jpg'
import platterImg from '../../assets/dishes/platter.webp'
import salverImg from '../../assets/dishes/salver.jpg'
import flatServingSpoonImg from '../../assets/dishes/flatServingSpoon.jpg'
import roundServingSpoonImg from '../../assets/dishes/roundServingSpoon.jpg'
import tongImg from '../../assets/dishes/tong.jpg'
import noneImg from '../../assets/dishes/none.png'

interface FoodItemForm {
    item_name: string
    item_type: boolean
    cutlery_type: string
    serving_spoon: string
    food_categories: string
}

// Custom Toggle Component for Veg/Non-veg
const VegToggle: React.FC<{
    value: boolean
    onChange: (value: boolean) => void
}> = ({ value, onChange }) => {
    return (
        <div className="flex items-center">
            <div
                className="relative w-14 h-6 cursor-pointer"
                onClick={() => onChange(!value)}
            >
                <div
                    className={`
                        absolute w-full h-full rounded-full transition-colors duration-200
                        ${value ? 'bg-green-500' : 'bg-red-500'}
                    `}
                />

                <div
                    className={`
                        absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                        ${value ? 'translate-x-0' : 'translate-x-8'}
                    `}
                />
            </div>

            <span className="ml-2 text-sm text-gray-600">
                {value ? 'Veg' : 'Non-Veg'}
            </span>
        </div>
    )
}

// Image Selection Card Component
const ImageSelectionCard: React.FC<{
    option: {
        value: string
        label: string
        imageSrc: string
    }
    selected: boolean
    onClick: () => void
}> = ({ option, selected, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div
            className={`relative cursor-pointer transition-all duration-200 ${
                selected
                    ? 'ring-2 ring-blue-500'
                    : 'hover:ring-2 hover:ring-blue-200'
            }`}
            onClick={onClick}
        >
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-50">
                {!isLoaded && (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <img
                    src={option.imageSrc}
                    alt={option.label}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            </div>
            <div className="p-2 text-center">
                <span className="text-sm font-medium text-gray-700">
                    {option.label}
                </span>
            </div>
            {selected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
        </div>
    )
}

const SelectionDialog: React.FC<{
    open: boolean
    onClose: () => void
    title: string
    options: Array<{ value: string; label: string; imageSrc: string }>
    selected: string
    onSelect: (value: string) => void
}> = ({ open, onClose, title, options, selected, onSelect }) => (
    <Dialog isOpen={open} onClose={onClose}>
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="grid grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto">
                {options.map((option) => (
                    <ImageSelectionCard
                        key={option.value}
                        option={option}
                        selected={selected === option.value}
                        onClick={() => {
                            onSelect(option.value)
                            onClose()
                        }}
                    />
                ))}
            </div>
        </div>
    </Dialog>
)

const CustomSelect: React.FC<{
    value: string
    onChange: (value: string) => void
    options: Array<{ value: string; label: string }>
    placeholder: string
}> = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || placeholder

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
                <div className="flex items-center justify-between">
                    <span>{selectedLabel}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const cutleryOptions = [
    {
        value: 'chafing_dish',
        label: 'Chafing Dish',
        imageSrc: chaffingDishImg,
    },
    {
        value: 'platter',
        label: 'Platter',
        imageSrc: platterImg,
    },
    {
        value: 'salver',
        label: 'salver',
        imageSrc: salverImg,
    },
]

const servingSpoonOptions = [
    {
        value: 'serving_spoon_round',
        label: 'Serving Spoon Round',
        imageSrc: roundServingSpoonImg,
    },
    {
        value: 'serving_spoon_flat',
        label: 'Serving Spoon Flat',
        imageSrc: flatServingSpoonImg,
    },
    {
        value: 'tong',
        label: 'Tong',
        imageSrc: tongImg,
    },
    {
        value: 'none',
        label: 'None',
        imageSrc: noneImg,
    },
]

const foodCategoriesOptions = [
    {
        value: 'Rice and Bread',
        label: 'Rice and Bread',
    },
    {
        value: 'Greavy',
        label: 'Greavy',
    },
    {
        value: 'Starters',
        label: 'Starters',
    },
    {
        value: 'Desserts',
        label: 'Desserts',
    },
    {
        value: 'Beverages',
        label: 'Beverages',
    },
    {
        value: 'Chaat (Street Food)',
        label: 'Chaat (Street Food)',
    },
    {
        value: 'Snacks',
        label: 'Snacks',
    },
    {
        value: 'Accompaniments',
        label: 'Accompaniments',
    },
]

const FoodItemForm: React.FC = () => {
    const [cutleryDialogOpen, setCutleryDialogOpen] = useState(false)
    const [spoonDialogOpen, setSpoonDialogOpen] = useState(false)

    const validationSchema = Yup.object().shape({
        item_name: Yup.string()
            .required('Required')
            .min(2, 'Too Short!')
            .max(50, 'Too Long!'),
        item_type: Yup.boolean().required('Required'),
        cutlery_type: Yup.string().required('Please select cutlery type'),
        serving_spoon: Yup.string().required(
            'Please select serving spoon type'
        ),
        food_categories: Yup.string().required(
            'Please select food categories type'
        ),
    })

    const submitForm = async (
        values: FoodItemForm,
        { setSubmitting, resetForm }: FormikHelpers<FoodItemForm>
    ) => {
        try {
            const { error } = await supabase
                .from('food_item_data')
                .insert([values])
            if (error) throw error
            resetForm()
            toast.push(
                <Notification title="Success" type="success">
                    Food item added successfully!
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error instanceof Error
                        ? error.message
                        : 'An error occurred'}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-[50%] p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
                Add Food Item
            </h2>
            <Formik
                initialValues={{
                    item_name: '',
                    item_type: true,
                    cutlery_type: '',
                    serving_spoon: '',
                    food_categories: '',
                }}
                validationSchema={validationSchema}
                onSubmit={submitForm}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="space-y-10">
                        <FormItem
                            asterisk
                            label="Item Name"
                            invalid={errors.item_name && touched.item_name}
                            errorMessage={errors.item_name}
                        >
                            <Field name="item_name">
                                {({ field, form }: FieldProps) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter item name"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const capitalizedValue =
                                                e.target.value
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (char) =>
                                                        char.toUpperCase()
                                                    )
                                            form.setFieldValue(
                                                'item_name',
                                                capitalizedValue
                                            )
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            asterisk
                            label="Item Type"
                            invalid={errors.item_type && touched.item_type}
                            errorMessage={errors.item_type}
                        >
                            <VegToggle
                                value={values.item_type}
                                onChange={(value) =>
                                    setFieldValue('item_type', value)
                                }
                            />
                        </FormItem>

                        <FormItem
                            asterisk
                            label="Cutlery Type"
                            invalid={
                                errors.cutlery_type && touched.cutlery_type
                            }
                            errorMessage={errors.cutlery_type}
                        >
                            <Button
                                type="button"
                                variant="default"
                                className="w-full flex flex-row justify-between items-center"
                                onClick={() => setCutleryDialogOpen(true)}
                            >
                                {values.cutlery_type
                                    ? cutleryOptions.find(
                                          (opt) =>
                                              opt.value === values.cutlery_type
                                      )?.label
                                    : 'Select Cutlery Type'}
                                <div className="">
                                    <IoIosArrowDown size={18} />
                                </div>
                            </Button>
                        </FormItem>

                        <FormItem
                            asterisk
                            label="Serving Spoon Type"
                            invalid={
                                errors.serving_spoon && touched.serving_spoon
                            }
                            errorMessage={errors.serving_spoon}
                        >
                            <Button
                                type="button"
                                variant="default"
                                className="w-full flex flex-row justify-between items-center"
                                onClick={() => setSpoonDialogOpen(true)}
                            >
                                {values.serving_spoon
                                    ? servingSpoonOptions.find(
                                          (opt) =>
                                              opt.value === values.serving_spoon
                                      )?.label
                                    : 'Select Serving Spoon Type'}
                                <div className="">
                                    <IoIosArrowDown size={18} />
                                </div>
                            </Button>
                        </FormItem>

                        <FormItem
                            label="Food categories"
                            asterisk
                            invalid={
                                errors.food_categories && touched.food_categories
                            }
                            errorMessage={errors.food_categories}
                        >
                            <CustomSelect
                                value={values.food_categories}
                                onChange={(value) =>
                                    setFieldValue('food_categories', value)
                                }
                                options={foodCategoriesOptions}
                                placeholder="Select serving spoon type"
                            />
                        </FormItem>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="button"
                                variant="default"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button type="submit" variant="solid">
                                Add Food Item
                            </Button>
                        </div>

                        <SelectionDialog
                            open={cutleryDialogOpen}
                            onClose={() => setCutleryDialogOpen(false)}
                            title="Select Cutlery Type"
                            options={cutleryOptions}
                            selected={values.cutlery_type}
                            onSelect={(value) =>
                                setFieldValue('cutlery_type', value)
                            }
                        />

                        <SelectionDialog
                            open={spoonDialogOpen}
                            onClose={() => setSpoonDialogOpen(false)}
                            title="Select Serving Spoon Type"
                            options={servingSpoonOptions}
                            selected={values.serving_spoon}
                            onSelect={(value) =>
                                setFieldValue('serving_spoon', value)
                            }
                        />

                        
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FoodItemForm
