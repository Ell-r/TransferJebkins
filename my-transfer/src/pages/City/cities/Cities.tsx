import "./Cities.css";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../../api/axiosInstance.ts";
import CardComponent from "../../../components/cards/CardComponent.tsx";

interface City{
    id: number;
    name: string,
    slug: string,
    country: string,
    description: string,
    image: string,
}

const Cities = () =>{

    const { id } = useParams<{ id: string }>();
    console.log(id);

    const [cities, setCities] = useState<City[]>([])

    useEffect(()=>{
        const getCities = async() =>{
            try {
                const response = await axiosInstance.get(`/City/by-country/${id}`);
                console.log("Упішно", response);
                setCities(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }

        getCities();
    }, [])

    return(
        <>
            <div className="container">
                <h2 className={"text-center mt-5 mb-5"}>Міста</h2>


                {
                    cities.map(item => (
                        <CardComponent id={item.id} image={`http://3.123.20.53:5898/images/${item.image}`} name={item.name} path={"/"}/>
                    ))
                }
            </div>
        </>
    );
}

export default Cities;