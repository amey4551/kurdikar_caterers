import React from 'react';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import * as Yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Card } from '@/components/ui';
import { supabase } from '@/backend/supabaseClient';
import { FieldProps } from 'formik';
import FoodItem from './FoodItem';

type Option = {
    value: string;
    label: string;
};

type FormModel = {
    order_date: Date | null;
    order_time: string;
    order_location: string;
    client_name: string;
    people_count: number;
    order_occasion: string;
};

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

const submitForm = async (values: FormModel, { setSubmitting, resetForm }: FormikHelpers<FormModel>) => {
    const { data, error } = await supabase
        .from('order_datetime_details')
        .insert([{
            order_date: values.order_date,
            order_time: values.order_time,
            order_location: values.order_location,
            client_name: values.client_name,
            people_count: values.people_count,
            order_occasion: values.order_occasion,
        }]);

    if (error) {
        console.error('Error inserting data:', error);
        alert('An error occurred while submitting the form.');
    } else {
        console.log('Data inserted successfully:', data);
        alert('Form submitted successfully!');
        resetForm();
    }
    setSubmitting(false);
};

const CustomForm = () => {
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
                onSubmit={submitForm}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form>
                        <Card className="mb-6 bg-gray-100">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
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
                                                    onChange={date => form.setFieldValue(field.name, date)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
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
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
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
                                </div>
                            </div>
                        </Card>

                        <Card className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                            <div className="flex gap-2">
                                <FormItem
                                className='w-6/12'
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
                                className='w-3/12'
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
                                className='w-3/12'
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
                                                value={occasionOptions.find(option => option.value === values.order_occasion)}
                                                onChange={option => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        </Card>

                        <Card className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Food Items</h2>
                            <FoodItem/>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                type="reset"
                                className="mr-4"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" loading={false    }>
                                Submit Order
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CustomForm;