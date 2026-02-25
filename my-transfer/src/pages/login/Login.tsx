import {GoogleLogin} from "@react-oauth/google";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.ts";
import InputWTextComponent from "../../components/inputs/InputWTextComponent.tsx";
import * as Yup from "yup";
import type {AxiosError} from "axios";
import {useState} from "react";
import type ApiErrorResponse from "../../interfaces/ApiErrorResponse.ts";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../services/authSlice.ts";
import type {AppDispatch} from "../../store";
import {jwtDecode} from "jwt-decode";
import type {UserTokenInfo} from "../../interfaces/UserTokenInfo.ts";
import "./Login.css";


const validationSchema = Yup.object().shape({
    email: Yup.string().required('Ввведіть пошту'),
    password: Yup.string().required("Введіть пароль"),
});

const Login = () =>{

    const initValues = {
        email: "",
        password: "",
    }

    const navigator = useNavigate();

    const [loginError, setLoginError] = useState("");

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const response = await axiosInstance.post("/Account/Login", values);
            console.log("Упішно", response);

            const {token} = response.data;
            dispatch(loginSuccess(token));

            const result = jwtDecode<UserTokenInfo>(token);
            console.log(result);

            navigator("/Profile");
            alert("Ви успішно увійшли в акаунт")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setLoginError(errorText || "Виникла помилка при вході в акаунт");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {values, errors, touched, handleSubmit, handleChange} = formik;

    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    return(
        <>
            <div className="container w-25">
                <h2 className={"text-center mt-5"}>Увійти в акаунт</h2>

                <div className="d-flex flex-column align-items-center mt-5 mb-5">
                    <GoogleLogin
                        width={400}
                        onSuccess={async (credentialResponse)=> {
                            if (!credentialResponse.credential) {
                                console.error("No credential");
                                return;
                            }

                            const response = await axiosInstance.post("/auth/GoogleLogin", {
                                idToken: credentialResponse.credential
                            });
                            console.log("Упішно", response);
                            dispatch(loginSuccess(response.data.token));

                            navigate("/Profile");
                        }}
                        onError={()=>console.log("error")}
                        auto_select={true}
                    />
                </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1 border-bottom"></div>
                    <span className="mx-2">Або</span>
                    <div className="flex-grow-1 border-bottom"></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column gap-3">
                        <InputWTextComponent
                            type={"text"}
                            label={"Введіть пошту"}
                            name={"email"}
                            value={values.email}
                            error={errors.email}
                            touched={touched.email}
                            onChange={handleChange}/>
                        <InputWTextComponent
                            type={"password"}
                            label={"Введіть пароль"}
                            name={"password"}
                            value={values.password}
                            error={errors.password}
                            touched={touched.password}
                            onChange={handleChange}/>
                    </div>

                    {loginError && <div className="invalid-feedback d-block">{loginError}</div>}
                    <button className="btn mt-5 w-100" type="submit">Увійти</button>
                    <Link to = "/ForgotPassword" className={"text-danger"}>Забули пароль?</Link>

                </form>


            </div>
        </>
    );
}

export default Login;