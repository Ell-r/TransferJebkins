import InputWTextComponent from "../../components/inputs/InputWTextComponent.tsx";
import * as Yup from "yup";
import {useState} from "react";
import {useFormik} from "formik";
import axiosInstance from "../../api/axiosInstance.ts";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../interfaces/ApiErrorResponse.ts";
import {useNavigate} from "react-router-dom";

const validationSchema = Yup.object().shape({
    email: Yup.string().required("Це поле є обов'язковим").email("Введіть пошту, на яку у вас зареєстрований акаунт"),
});

const ForgotPassword = () => {

    const initValues = {
        email: "",
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const response = await axiosInstance.post("/Account/ForgotPassword", values);
            console.log("Упішно", response);

            navigator("/Login");
            alert("Лист із посиланням на відновлення паролю успішно відправлено")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setForgotPasswordError(errorText || "Виникла помилка при відновленні паролю");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {values, errors, touched, handleSubmit, handleChange} = formik;

    const navigator = useNavigate();

    const [forgotPasswordError, setForgotPasswordError] = useState("");

    return (
        <form onSubmit={handleSubmit} className="container w-25 mt-5">
            <h3 className={"text-center mb-4"}>Відновлення паролю</h3>
            <InputWTextComponent type={"text"} label={"Введіть пошту"} name={"email"} value={values.email} onChange={handleChange} error={errors.email} touched={touched.email}/>
            <button className="btn mt-5 w-100" type="submit">Відновити пароль</button>
            <p className="text-danger">{forgotPasswordError}</p>
        </form>
    );
}

export default ForgotPassword;