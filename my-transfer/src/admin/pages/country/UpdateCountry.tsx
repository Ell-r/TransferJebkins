import InputWTextComponent from "../../../components/inputs/InputWTextComponent.tsx";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useEffect, useState} from "react";
import axiosInstance from "../../../api/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../../interfaces/ApiErrorResponse.ts";
import "../baseStyle.css";

interface Country {
    id: number;
    name: string;
    slug: string;
    code: string;
    image: null;
}

const validationSchema = Yup.object().shape({
    id: Yup.number().required("Введіть айді країни"),
    name: Yup.string().required('Введіть назву країни'),
    code: Yup.string().required("Введіть код країни"),
    slug: Yup.string().required("Введіть slug країни"),
});


const CreateCountry = () =>{

    const navigator = useNavigate();

    const [updatingError, setUpdatingError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country>()
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        const getCountries = async () =>{
            try {
                const response = await axiosInstance.get("/Country");
                console.log("Упішно", response);
                setCountries(response.data);
                setSelectedCountry(response.data[0] ?? null);
            }
            catch(error) {
                console.log(error);
            }
        }
        getCountries();
    }, [])

    const initValues = {
        id: 0,
        name: "",
        code: "",
        slug: "",
        image: null as File | null,
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {
            const response = await axiosInstance.put("/Country/UpdateCountry", values, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Упішно", response);
            navigator("/");
            alert("Країна успішно відредагована")
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setUpdatingError(errorText || "Виникла помилка при редагуванні країни");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement> ) =>{
        const countryId = Number(e.target.value);
        const country = countries.find(c => c.id === countryId);

        if (!country) return;

        setSelectedCountry(country);

        formik.setFieldValue("id", country.id);
        formik.setFieldValue("name", country.name);
        formik.setFieldValue("code", country.code);
        formik.setFieldValue("slug", country.slug);
        formik.setFieldValue("image", null);
    }

    const {values, errors, touched, handleSubmit, handleChange} = formik;


    return(
        <>
            <form onSubmit={handleSubmit} className="container w-25">
                <div className="d-flex flex-column gap-4">
                    <h2 className={"text-center mt-5"}>Створення країни</h2>

                    <select value={selectedCountry?.id} onChange={handleChangeOption} className={"form-control"}>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.id}
                            </option>
                        ))}
                    </select>

                    <img src = {`http://localhost:5242/images/${selectedCountry?.image}`} alt="country" />

                    <InputWTextComponent
                        type="file"
                        name="image"
                        label="Оберіть нове фото країни"
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

                    {updatingError && <div className="invalid-feedback d-block">{updatingError}</div>}
                    <button type = "submit" className={"btn mt-5"}>Редагувати</button>
                </div>
            </form>
        </>
    );
}

export default CreateCountry;