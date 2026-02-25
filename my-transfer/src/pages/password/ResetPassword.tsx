import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance.ts";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../interfaces/ApiErrorResponse.ts";
import {useFormik} from "formik";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import InputWTextComponent from "../../components/inputs/InputWTextComponent.tsx";

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("Це поле є обов'язковим"),
    confirmNewPassword: Yup.string().required("Це поле є обов'язковим").oneOf([Yup.ref("newPassword")], "Паролі не співпадають"),
});

const ResetPassword = () => {

    const initValues = {
        newPassword: "",
        confirmNewPassword: "",
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const params = {
                email: email,
                token: token,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword,
            };
            const response = await axiosInstance.post("/Account/ResetPassword", params);
            console.log("Упішно", response);

            navigator("/Login");
            alert("Новий пароль збережено. Спробуйте увійти в акаунт")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setPasswordError(errorText || "Виникла помилка при відновленні паролю");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const [params] = useSearchParams();

    const token = params.get("token");
    const email = params.get("email");

    const {values, errors, touched, handleSubmit, handleChange} = formik;

    const navigator = useNavigate();

    const [passwordError, setPasswordError] = useState("");

    return(
        <form onSubmit={handleSubmit} className="container d-flex flex-column gap-3 w-25 mt-5">
            <h3 className={"text-center mb-4"}>Відновлення паролю</h3>
            <InputWTextComponent type={"password"} label={"Введіть пароль"} name={"newPassword"} value={values.newPassword} onChange={handleChange} error={errors.newPassword} touched={touched.newPassword}/>
            <InputWTextComponent type={"password"} label={"Повторіть пароль"} name={"confirmNewPassword"} value={values.confirmNewPassword} onChange={handleChange} error={errors.confirmNewPassword} touched={touched.confirmNewPassword}/>
            <button className="btn mt-5 w-100" type="submit">Відновити пароль</button>
            <p className="text-danger">{passwordError}</p>
        </form>
    );
}

export default ResetPassword;