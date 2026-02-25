import {useEffect, useState} from "react";
import "./Cart.css";
import axiosInstance from "../../api/axiosInstance.ts";
import CartItem from "../cartItem/CartItem.tsx";

interface CartProps{
    isOpen: boolean;
    onClose: () => void;
}

interface TripsList{
    quantity: number;
    id: number;
    fromCityName: string;
    toCityName: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: number;
    statusName: string;
}

const Cart: React.FC<CartProps> = ({isOpen, onClose}) =>{

    const token = localStorage.getItem("token");
    const [tripsInCart, setTripsInCart] = useState<TripsList[]>([]);

    useEffect(()=>{
        if(!isOpen)
            return;

        const setCart = async ()=>{
            try{

                const response = await axiosInstance.get("/Carts/GetList",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const exiredTrips = [];
                const activeTrips = [];
                for(const trip of response.data){
                    if(new Date(trip.departureTime) < new Date()){
                        exiredTrips.push(trip);
                    }
                    else{
                        activeTrips.push(trip);
                    }
                }



                setTripsInCart(activeTrips);
                console.log(response);
            }
            catch{
                setTripsInCart([]);
            }
        }

        setCart();
    }, [isOpen]);


    return(
        <div
            className={`cart-overlay ${isOpen ? "open" : ""}`}
            onClick={onClose}
        >
            <div
                className={`cart-content ${isOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}>

                <div className={"cart-header"}>
                    <i className="fa-solid fa-xmark cursor-pointer mt-2 ms-2 fs-5" onClick={onClose}></i>
                    <h4>Кошик</h4>
                    <div></div>
                </div>

                {tripsInCart.length == 0 ? (
                        <div className="cart-body-empty">
                            <div className="empty-cart">
                                Кошик порожній
                            </div>
                        </div>
                ) : (
                    <div className="cart-body">
                        {tripsInCart.map(trip => {
                            const departure = new Date(trip.departureTime);
                            const arrival = new Date(trip.arrivalTime);

                            return(
                              <CartItem
                                  id = {trip.id}
                                  quantity={trip.quantity}
                                  key = {trip.id}
                                  toCityName={trip.toCityName}
                                  fromCityName={trip.fromCityName}
                                  seatsAvailable={trip.seatsAvailable}
                                  departureDay={`${departure.getMonth() + 1}.${departure.getDate()}`}
                                  arrivalDay={`${arrival.getMonth() + 1}.${arrival.getDate()}`}
                                  departureTime={departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  arrivalTime={arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              />
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Cart;