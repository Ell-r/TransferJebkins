import "./CardTrip.css";
import "../component.css";

interface Trip {
    id: number;
    cityFrom: string;
    cityTo: string;
    departureDay: string;
    arrivalDay: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: boolean;
    addToCart: () => void;
}

const CardTrip: React.FC<Trip> = ({id, cityFrom, cityTo, departureDay, arrivalDay, departureTime, arrivalTime, seatsAvailable, addToCart}) => {
    return(
        <>
            <div className = "trip-card w-25 rounded-2" key = {id}>
                <div className = "d-flex flex-column p-3">
                    <div className = "d-flex flex-row justify-content-between">
                        <p>{departureDay}</p>
                        <p>{arrivalDay}</p>
                    </div>
                    <div className = "d-flex flex-row justify-content-between">
                        <h5>{departureTime}</h5>
                        <h5>{arrivalTime}</h5>
                    </div>

                    <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-row gap-2">
                            <p>{cityFrom}</p>
                            <i className="fa-solid fa-arrow-right mt-1 fs-5"></i>
                            <p>{cityTo}</p>
                        </div>

                        <div className="d-flex flex-row gap-2">
                            <p>{seatsAvailable} вільно</p>
                        </div>
                    </div>

                    <button className={"btn mt-4"} onClick={addToCart}>
                        Додати в кошик
                    </button>
                </div>
            </div>
        </>
    );
}

export default CardTrip;