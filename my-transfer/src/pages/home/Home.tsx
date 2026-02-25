import {useEffect, useState} from "react";
import {GetAll} from "../../components/Axios/CountryService.ts";
import "./Home.css";
import CardComponent from "../../components/cards/CardComponent.tsx";

interface Country {
    id: number;
    name: string;
    code: string;
    slug: string;
    image: string;
}

const Home = () =>{

    const [countries, setCountries] = useState<Country[]>([])

    useEffect(() => {
        const getAllCountries = async () => {
            try {
                const data = await GetAll();
                setCountries(data ?? []);
            }
            catch {
                setCountries([]);
            }

        };
        getAllCountries();
    }, []);

    return(
        <>
            <div className = "container">

                <h2 className = "text-center mt-5">Доставимо з комфортом до таких країн</h2>


                <div className = "d-flex flex-row gap-3 flex-wrap align-items-center mt-5">
                    {
                        countries.length > 0 && countries.map(item => (
                            <CardComponent id={item.id} image={`http://3.123.20.53:5898/images/${item.image}`} name={item.name} path={`/Cities/${item.id}`}/>
                        ))
                    }
                </div>

            </div>
        </>
    );
}

export default Home;