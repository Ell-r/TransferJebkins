import CardTrip from "../../components/cards/CardTrip.tsx";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/axiosInstance.ts";

interface Trip{
    id: number;
    fromCityName: string;
    toCityName: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: boolean;
    statusName: string;
}

const Trips = () =>{

    const token = localStorage.getItem("token");
    const [trips, setTrips] = useState<Trip[]>([]);

    const AddToCart = (transportationId: number, quantity: number) => {
        try{
            const response = axiosInstance.post("/Carts/AddUpdate", {transportationId, quantity},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log(response);
        }
        catch{
            console.log("Error");
        }
    }

    useEffect(() => {
        const getAllTrips = async () =>{
            try {
                const response = await axiosInstance.get("/Transportations/GetList");
                const trips = response.data;

                const filteredTrips = response.data.filter((trip: Trip) => {
                    return new Date(trip.departureTime) >= new Date();
                });

                setTrips(filteredTrips);
                console.log(trips);
            }
            catch{
                setTrips([]);
            }
        }

        getAllTrips();
    }, [])


    return(
        <>
            <h2 className={"text-center mt-5"}>Поїздки</h2>
            <div className="container mt-5 d-flex flex-row gap-5 flex-wrap">
                {
                    trips.map(trip => {
                        const departure = new Date(trip.departureTime);
                        const arrival = new Date(trip.arrivalTime);

                        return (
                            <CardTrip
                                id = {trip.id}
                                key={trip.id}
                                cityFrom={trip.fromCityName}
                                cityTo={trip.toCityName}
                                seatsAvailable={trip.seatsAvailable}
                                departureDay={`${departure.getMonth() + 1}.${departure.getDate()}`}
                                arrivalDay={`${arrival.getMonth() + 1}.${arrival.getDate()}`}
                                departureTime={departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                arrivalTime={arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                addToCart = {() => AddToCart(trip.id, 1)}
                            />
                        );
                    })
                }
            </div>
        </>
    );
}

export default Trips