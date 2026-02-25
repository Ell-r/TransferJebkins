import InputWTextComponent from "../../../components/inputs/InputWTextComponent.tsx";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useState} from "react";
import axiosInstance from "../../../api/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../../interfaces/ApiErrorResponse.ts";
import "../baseStyle.css";

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Введіть назву країни'),
    code: Yup.string().required("Введіть код країни"),
    slug: Yup.string().required("Введіть slug країни"),
    image: Yup.mixed().required('Файл повинен бути фотографією')
});


const CreateCountry = () =>{

    const navigator = useNavigate();

    const [creatingError, setCreatingError] = useState("");

    const initValues = {
        name: "",
        code: "",
        slug: "",
        image: null as File | null,
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const response = await axiosInstance.post("/Country/CreateCountry", values, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Упішно", response);
            navigator("/");
            alert("Країна успішно створена")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setCreatingError(errorText || "Виникла помилка при створенні країни");
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
                    <h2 className={"text-center mt-5"}>Створення країни</h2>

                    <InputWTextComponent
                        type="file"
                        name="image"
                        label="Оберіть фото країни"
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
                        name="name"
                        label="Введіть назву країни"
                        value={values.name}
                        error={errors.name}
                        touched={touched.name}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="text"
                        name="code"
                        label="Введіть код країни"
                        value={values.code}
                        error={errors.code}
                        touched={touched.code}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="text"
                        name="slug"
                        label="Введіть slug країни"
                        value={values.slug}
                        error={errors.slug}
                        touched={touched.slug}
                        onChange={handleChange}
                    />

                    {creatingError && <div className="invalid-feedback d-block">{creatingError}</div>}
                    <button type = "submit" className={"btn mt-5"}>Створити</button>
                </div>
            </form>
        </>
    );
}

export default CreateCountry;