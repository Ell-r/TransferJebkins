import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axiosInstance from "../../api/axiosInstance.ts";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../interfaces/ApiErrorResponse.ts";
import {useFormik} from "formik";
import InputWTextComponent from "../../components/inputs/InputWTextComponent.tsx";


const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Ввведіть ім'я"),
    lastName: Yup.string().required("Ввведіть ім'я"),
    image: Yup.mixed().required('Файл повинен бути фотографією'),
    email: Yup.string().required('Ввведіть пошту'),
    password: Yup.string().required("Введіть пароль"),
    repeatPassword: Yup.string().required("Повторіть пароль").oneOf([Yup.ref("password")], "Паролі не співпадають"),
});

const Register = () =>{

    const initValues = {
        firstName: "",
        lastName: "",
        image: null as File | null,
        email: "",
        password: "",
        repeatPassword: "",
    }

    const navigator = useNavigate();

    const [registerError, setRegisterError] = useState("");

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            console.log(values);
            const response = await axiosInstance.post("/Account/Register", values, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Упішно", response);
            navigator("/Login");
            alert("Ви успішно зареєструвалися")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setRegisterError(errorText || "Виникла помилка при реєстрації");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {values, errors, touched, handleSubmit, handleChange} = formik;


    return(
        <>
            <form onSubmit={handleSubmit} className="container w-25">
                <div className="d-flex flex-column gap-4">
                    <h2 className={"text-center mt-5"}>Реєстрація</h2>

                    <InputWTextComponent
                        type="file"
                        name="image"
                        label="Оберіть фото"
                        error={errors.image}
                        touched={touched.image}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const files: FileList | null = e.currentTarget.files;
                            if (files && files.length > 0) {
                                formik.setFieldValue("image", files[0]);
                            }
                        }}
                    />

                    <InputWTextComponent
                        type="text"
                        name="firstName"
                        label="Введіть ім'я"
                        value={values.firstName}
                        error={errors.firstName}
                        touched={touched.firstName}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="text"
                        name="lastName"
                        label="Введіть прізвище"
                        value={values.lastName}
                        error={errors.lastName}
                        touched={touched.lastName}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="text"
                        name="email"
                        label="Введіть пошту"
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="password"
                        name="password"
                        label="Введіть пароль"
                        value={values.password}
                        error={errors.password}
                        touched={touched.password}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="password"
                        name="repeatPassword"
                        label="Підтвердіть пароль"
                        value={values.repeatPassword}
                        error={errors.repeatPassword}
                        touched={touched.repeatPassword}
                        onChange={handleChange}
                    />

                    {registerError && <div className="invalid-feedback d-block">{registerError}</div>}
                    <button type = "submit" className={"btn mt-5"}>Створити</button>
                </div>
            </form>
        </>
    );
}

export default Register;