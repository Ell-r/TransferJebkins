import "./CartItem.css";
import axiosInstance from "../../api/axiosInstance.ts";
import {useState} from "react";

interface ItemProps{
    quantity: number;
    id: number;
    key: number;
    fromCityName: string;
    toCityName: string;
    departureDay: string;
    arrivalDay: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: number;
}

const CartItem: React.FC<ItemProps> = ({quantity, id, key, departureDay, arrivalDay, departureTime, arrivalTime, seatsAvailable, toCityName, fromCityName}) =>{

    const token = localStorage.getItem("token");
    const [localQuantity, setLocalQuantity] = useState(quantity);

    const ChangeQuantity = async (transportationId: number, quantity: number) => {
        try{
            const response = await axiosInstance.post("/Carts/AddUpdate", {transportationId, quantity},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            setLocalQuantity(quantity);
        }
        catch{
            console.log("Error");
        }
    }

    return(
        <>
            <div className = "trip-card rounded-2 mt-3" key = {key}>
                <div className = "d-flex flex-column p-3">
                    <div className = "d-flex flex-row justify-content-between">
                        <p>{departureDay}</p>
                        <p>{arrivalDay}</p>
                    </div>
                    <div className = "d-flex flex-row justify-content-between">
                        <h5>{departureTime}</h5>
                        <h5>{arrivalTime}</h5>
                    </div>

                    <div className="d-flex flex-row">
                        <div className="d-flex flex-row gap-2">
                            <p>{fromCityName}</p>
                            <i className="fa-solid fa-arrow-right mt-1 fs-5"></i>
                            <p>{toCityName}</p>
                        </div>
                    </div>

                    <hr/>

                    <div className="d-flex flex-row gap-2 mt-1 justify-content-between">
                        <div className="d-flex flex-row gap-2">
                            <button disabled={localQuantity == 1} className={"btn changeBtn"}
                                    onClick={() => ChangeQuantity(id, localQuantity - 1)}>-
                            </button>
                            <p className={"fs-5"}>{localQuantity}</p>
                            <button disabled={localQuantity >= seatsAvailable} className={"btn changeBtn"}
                                    onClick={() => ChangeQuantity(id, localQuantity + 1)}>+
                            </button>
                        </div>

                        <p>{seatsAvailable} доступно місць</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartItem