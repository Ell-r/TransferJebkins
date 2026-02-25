import {useEffect, useState} from "react";
import {GetAll} from "../../../components/Axios/CountryService.ts";
import CardComponent from "../../../components/cards/CardComponent.tsx";

interface Country {
    id: number;
    name: string;
    code: string;
    slug: string;
    image: string;
}

const Countries = () =>{

    const [countries, setCountries] = useState<Country[]>([])

    useEffect(() => {
        const getAllCountries = async () => {
            const data = await GetAll();
            setCountries(data);
        };
        getAllCountries();
    }, []);

    return(
        <>
            <div className = "container">

                <h2 className = "text-center mt-5">Список країн</h2>


                <div className = "d-flex flex-row gap-3 flex-wrap align-items-center mt-5">
                    {
                        countries.map(item => (
                            <CardComponent id={item.id} image={item.image} name={item.name} path={`/Cities/${item.id}`}/>
                        ))
                    }
                </div>

            </div>
        </>
    );
}

export default Countries;