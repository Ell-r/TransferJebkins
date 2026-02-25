import InputWTextComponent from "../../../components/inputs/InputWTextComponent.tsx";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useEffect, useState} from "react";
import axiosInstance from "../../../api/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import type {AxiosError} from "axios";
import FnEditorComponent from "../../components/FnEditorComponent.tsx";

interface ApiErrorResponse {
    errors: string[];
}

interface Country {
    id: number;
    name: string;
    slug: string;
    code: string;
    image: null;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Введіть назву міста'),
    slug: Yup.string().required("Введіть slug міста"),
    description: Yup.string().required("Введіть опис міста"),
    countryId: Yup.number().required("Оберіть айді країни"),
    image: Yup.mixed().required('Файл повинен бути фотографією')
});


const CreateCity = () =>{

    const navigator = useNavigate();

    const [creatingError, setCreatingError] = useState("");
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        const getAllCountries = async () =>{
            try {
                const response = await axiosInstance.get("/Country");
                console.log("Упішно", response);
                setCountries(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }

        getAllCountries();
    }, [])

    const initValues = {
        name: "",
        slug: "",
        description: "",
        countryId: 0,
        image: null as File | null,
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const response = await axiosInstance.post("/City/CreateCity", values, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Упішно", response);
            navigator("/");
            alert("Місто успішно створене")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setCreatingError(errorText || "Виникла помилка при створенні міста");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {values, errors, touched, handleSubmit, handleChange} = formik;

    const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement> ) =>{
        const countryId = Number(e.target.value);
        const country = countries.find(c => c.id === countryId);

        if (!country) return;

        formik.setFieldValue("countryId", countryId);

    }

    return(
        <>
            <form onSubmit={handleSubmit} className="container w-25">
                <div className="d-flex flex-column gap-4">
                    <h2 className={"text-center mt-5"}>Створення міста</h2>

                    <select
                        value={values.countryId}
                        onChange={handleChangeOption}
                        className={"form-control"}
                        name="countryId">
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.id}
                            </option>
                        ))}
                    </select>

                    <InputWTextComponent
                        type="file"
                        name="image"
                        label="Оберіть фото міста"
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
                        label="Введіть назву міста"
                        value={values.name}
                        error={errors.name}
                        touched={touched.name}
                        onChange={handleChange}
                    />

                    <InputWTextComponent
                        type="text"
                        name="slug"
                        label="Введіть slug міста"
                        value={values.slug}
                        error={errors.slug}
                        touched={touched.slug}
                        onChange={handleChange}
                    />

                    <FnEditorComponent name = {"description"} value = {values.description} onChange={(content) => formik.setFieldValue("description", content)} error={errors.description} touched = {touched.description} />

                    {creatingError && <div className="invalid-feedback d-block">{creatingError}</div>}
                    <button type = "submit" className={"btn mt-5"}>Створити</button>
                </div>
            </form>
        </>
    );
}

export default CreateCity;