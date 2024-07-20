import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import TimeInput from '@/components/ui/TimeInput';
import * as Yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Card } from '@/components/ui';
import { supabase } from '@/backend/supabaseClient';
import { FieldProps } from 'formik';

type Option = {
    value: string;
    label: string;
};

type FormModel = {
    order_date: Date | null;
    order_time: Date | null;
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
    order_time: Yup.date().required('Time Required!').nullable(),
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

const formatOrderTime = (orderTime: Date | null) =>
    orderTime ? orderTime.toISOString().substr(11, 8) : null;

const submitForm = async (values: FormModel, { setSubmitting, resetForm }: FormikHelpers<FormModel>) => {
    const formattedTime = formatOrderTime(values.order_time);

    const { data, error } = await supabase
        .from('order_datetime_details')
        .insert([{
            order_date: values.order_date,
            order_time: formattedTime,
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
        <div className='flex justify-center'>
            <Card className='w-1/2'>
                <Formik
                    enableReinitialize
                    initialValues={{
                        order_date: null,
                        order_time: null,
                        order_location: '',
                        client_name: '',
                        people_count: 1,
                        order_occasion: '',
                    } as FormModel}
                    validationSchema={validationSchema}
                    onSubmit={submitForm}
                >
                    {({ values, touched, errors, resetForm }) => (
                        <Form>
                            <FormContainer>
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
                                <FormItem
                                    asterisk
                                    label="Order Time"
                                    invalid={errors.order_time && touched.order_time}
                                    errorMessage={errors.order_time}
                                >
                                    <Field name="order_time">
                                        {({ field, form }: FieldProps<Date | null>) => (
                                            <TimeInput
                                                field={field}
                                                form={form}
                                                value={values.order_time}
                                                onChange={time => form.setFieldValue(field.name, time)}
                                            />
                                        )}
                                    </Field>
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
                                                value={occasionOptions.find(option => option.value === values.order_occasion)}
                                                onChange={option => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="reset"
                                        className="ltr:mr-2 rtl:ml-2"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
                                    <Button variant="solid" type="submit">
                                        Submit
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default CustomForm;
