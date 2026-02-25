import "../baseStyle.css";
import * as Yup from "yup";
import axiosInstance from "../../../api/axiosInstance.ts";
import type {AxiosError} from "axios";
import type ApiErrorResponse from "../../../interfaces/ApiErrorResponse.ts";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import InputWTextComponent from "../../../components/inputs/InputWTextComponent.tsx";

const validationSchema = Yup.object().shape({
    name: Yup.string(),
    startDate: Yup.string(),
    endDate: Yup.string(),
    page: Yup.number(),
    itemPerPage: Yup.number(),
});

interface IUsers {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    roles: string[] | undefined;
}


const Users = () =>{

    const initValues = {
        name: "",
        startDate:"",
        endDate: "",
        page: 1,
        itemPerPage: 10,
    }

    const handleFormikSubmit = async (values: typeof initValues) => {
        try {

            const params = {
                name: values.name,
                page: 1,
                itemPerPage: values.itemPerPage,
                startDate: values.startDate
                    ? `${values.startDate}T00:00:00Z`
                    : null,

                endDate: values.endDate
                    ? `${values.endDate}T23:59:59Z`
                    : null,
            };

            const response = await axiosInstance.get("/Account/Search", {
                params: params
            });
            console.log("Упішно", response);
            setUsers(response.data.items);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.totalPages == 0 ? 0 : 1);
            setSearchError("");
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorsObj = err.response?.data?.errors ?? {};
            const errorText = Object.values(errorsObj).flat().join(", ");
            setSearchError(errorText || "Виникла помилка при пошуку користувача/ів");
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: handleFormikSubmit
    });

    const {values, errors, touched, handleSubmit, handleChange} = formik;


    const [searchError, setSearchError] = useState("");
    const [users, setUsers] = useState<IUsers[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const onHandleClickClear = async () => {
        const response = await axiosInstance.get("/User");
        setUsers(response.data);
        setSearchError("");
        formik.resetForm();
    }

    const onHandleMore = async () => {
        const params = {
            name: values.name,
            page: currentPage + 1,
            itemPerPage: values.itemPerPage,
            startDate: values.startDate
                ? `${values.startDate}T00:00:00Z`
                : null,

            endDate: values.endDate
                ? `${values.endDate}T23:59:59Z`
                : null,
        };
        setCurrentPage(currentPage + 1);

        const response = await axiosInstance.get("/Account/Search", {
            params: params
        });

        setUsers(prev => [...prev, ...response.data.items]);
    }

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await axiosInstance.get("/User");
                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error loading users", error);
            }
        };

        getAllUsers();
    }, []);

    return(
        <>
            <div className="container">
                <h3 className={"text-center mt-5 mb-4"}>Користувачі</h3>
                <form onSubmit={handleSubmit}
                      className="container d-flex flex-column gap-3 find-panel border rounded-2 p-4 w-50">
                    <h4 className={"text-center"}>Пошук</h4>
                    <InputWTextComponent type={"text"} label={"Ім'я або/та прізвише"} name={"name"}
                                         touched={touched.name} error={errors.name} value={values.name}
                                         onChange={handleChange}/>
                    <InputWTextComponent type={"date"} label={"Від дати створення"} name={"startDate"}
                                         onChange={handleChange}/>
                    <InputWTextComponent type={"date"} label={"До дата створення"} name={"endDate"}
                                         onChange={handleChange}/>
                    <div className = "d-flex flex-row w-100 gap-4">
                        <button type="submit" className={"btn mt-5 w-100"}>Пошук</button>
                        <button type="button" onClick={onHandleClickClear} className={"btn mt-5 w-100"}>Очистити</button>
                    </div>

                    <p className={"text-danger"}>{searchError}</p>
                </form>

                <table className="table mt-5">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Ім'я</th>
                        <th scope="col">Прізвище</th>
                        <th scope="col">Пошта</th>
                        <th scope="col">Аватарка</th>
                        <th scope="col">Ролі</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.map(item =>(
                            <tr>
                                <th scope="row">{item.id}</th>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.email}</td>
                                <td><img src ={`http://mysimplesupersite.somee.com/images/${item.image}`} alt = "avatar" width={30} className={"rounded-circle"}/></td>
                                <td>{item.roles}</td>
                            </tr>
                        ))
                    }

                    </tbody>
                </table>
                <button onClick={onHandleMore} type = "button" className={"btn w-100 mt-5"} disabled={currentPage === totalPages}>Завантажити ще</button>
            </div>
        </>
    );
}

export default Users;