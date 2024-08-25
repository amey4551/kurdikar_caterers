import React, { useState } from 'react';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import * as Yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { supabase } from '@/backend/supabaseClient';
import { FieldProps } from 'formik';
import dayjs from 'dayjs';
import { FoodItemType, FormModel, Option } from '@/@types/createOrder.type';
import { useNavigate } from 'react-router-dom';

const occasionOptions: Option[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'meeting', label: 'Meeting' },
];

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
});

const submitForm = async (
    values: FormModel,
    selectedItems: FoodItemType[],
    navigate: (path: string) => void, // Pass navigate here
    { setSubmitting, resetForm }: FormikHelpers<FormModel>
) => {
    const formattedDate = values.order_date
        ? dayjs(values.order_date).format('YYYY-MM-DD')
        : null;

    const { data: orderData, error: orderError } = await supabase
        .from('order_datetime_details')
        .insert([
            {
                order_date: formattedDate,
                order_time: values.order_time,
                order_location: values.order_location,
                client_name: values.client_name,
                people_count: values.people_count,
                order_occasion: values.order_occasion,
                order_status: 'D',
            },
        ])
        .select('id')
        .single();

    if (orderError) {
        alert('An error occurred while submitting the order details.');
        setSubmitting(false);
        return;
    }

    const orderId = orderData.id;
    if (orderId) {
        navigate(`/orderDetails/${orderId}`);
    }

    setSubmitting(false);
};

const CreateDraftForm = () => {
    const [selectedItems, setSelectedItems] = useState<FoodItemType[]>([]);
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <Formik
                enableReinitialize
                initialValues={{
                    order_date: null,
                    order_time: '12:00',
                    order_location: '',
                    client_name: '',
                    people_count: 1,
                    order_occasion: '',
                } as FormModel}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => submitForm(values, selectedItems, navigate, actions)}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form>
                        <div className="space-y-6">
                            <FormItem
                                asterisk
                                label="Order Date"
                                invalid={errors.order_date && touched.order_date}
                                errorMessage={errors.order_date}
                            >
                                <Field name="order_date">
                                    {({ field, form }: FieldProps<Date | null>) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            value={values.order_date}
                                            onChange={(date) =>
                                                form.setFieldValue(field.name, date)
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                asterisk
                                label="Order Time"
                                invalid={errors.order_time && touched.order_time}
                                errorMessage={errors.order_time}
                            >
                                <TimePicker
                                    onChange={(time) => setFieldValue('order_time', time)}
                                    value={values.order_time}
                                    disableClock={true}
                                    clearIcon={null}
                                    className="w-full"
                                />
                            </FormItem>

                            <FormItem
                                asterisk
                                label="Order Location"
                                invalid={errors.order_location && touched.order_location}
                                errorMessage={errors.order_location}
                            >
                                <Field
                                    type="text"
                                    name="order_location"
                                    placeholder="Location"
                                    component={Input}
                                />
                            </FormItem>

                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

                            <FormItem
                                asterisk
                                label="Client Name"
                                invalid={errors.client_name && touched.client_name}
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
                                invalid={errors.people_count && touched.people_count}
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
                                invalid={errors.order_occasion && touched.order_occasion}
                                errorMessage={errors.order_occasion}
                            >
                                <Field name="order_occasion">
                                    {({ field, form }: FieldProps<string>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={occasionOptions}
                                            value={occasionOptions.find(
                                                (option) =>
                                                    option.value === values.order_occasion
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(field.name, option?.value)
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </div>
                        <div className="flex justify-end mt-8">
                            <Button
                                type="reset"
                                className="mr-4"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" loading={false}>
                                Submit Order
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateDraftForm;
