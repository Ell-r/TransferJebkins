import InputWTextComponent from "../../../components/inputs/InputWTextComponent.tsx";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useState} from "react";
import axiosInstance from "../../../api/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../../interfaces/ApiErrorResponse.ts";

const validationSchema = Yup.object().shape({
    id: Yup.number().required('Введіть айді країни'),
});


const DeleteCountry = () =>{

    const navigator = useNavigate();

    const [deletingError, setDeletingError] = useState("");

    const initValues = {
        id: 0,
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            console.log(values);
            const response = await axiosInstance.delete(`/Country/${values.id}`);
            console.log("Упішно", response);
            navigator("/");
            alert("Країна успішно видалена")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setDeletingError(errorText || "Виникла помилка при видалені країни");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {errors, touched, handleSubmit, handleChange} = formik;


    return(
        <>
            <form onSubmit={handleSubmit} className="container w-25">
                <div className="d-flex flex-column gap-4">
                    <h2 className={"text-center mt-5"}>Видалення країни</h2>

                    <InputWTextComponent
                        type="num"
                        name="id"
                        label="Введіть айді країни"
                        error={errors.id}
                        touched={touched.id}
                        onChange={handleChange}
                    />

                    {deletingError && <div className="invalid-feedback d-block">{deletingError}</div>}
                    <button type = "submit" className={"btn mt-5"}>Видалити</button>
                </div>
            </form>
        </>
    );
}

export default DeleteCountry;