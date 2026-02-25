import {Link, useNavigate} from "react-router-dom"
import "./Header.css";
import {useAppDispatch, useAppSelector} from "../../store";
import {logout} from "../../services/authSlice.ts";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useState} from "react";
import Cart from "../../components/cart/Cart.tsx";

const Header = () => {

    const user =
        useAppSelector(redux => redux.auth.user);
    console.log("User auth", user);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAdmin = Array.isArray(user?.roles) ? user.roles.includes("Admin") : user?.roles === "Admin";
    console.log("is admin", isAdmin);
    const {theme, toggleTheme} = useTheme();

    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <div className="d-flex flex-row header align-items-center gap-3 justify-content-evenly dark:bg-gray-900">

                <div className="d-flex flex-row gap-5">
                    <h2><Link to="/">Країни</Link></h2>
                    <h2><Link to="/Trips">Поїздки</Link></h2>
                </div>

                <div className="d-flex flex-row gap-5">
                    {
                        user != null ? (
                                <div className="d-flex flex-row gap-4">

                                    <Link to="/Profile">
                                        <div className="d-flex flex-row gap-3">
                                            <img src={`${user ? `http://3.123.20.53:5898/images/` + user.image : "default.webp"}`} alt="user" width={40}
                                                 className="rounded-circle"/>
                                            <h4>{`${user?.name}`}</h4>
                                        </div>
                                    </Link>
                                    {isAdmin && <Link to="/Admin" className={"mt-2"}>Адмін панель</Link>}
                                    <span onClick={() => {
                                        appDispatch(logout());
                                        navigate("/");
                                    }} className={"mt-2 hover:cu"}>Вийти</span>
                                </div>
                            )
                            :
                            <div className="d-flex flex-row gap-3">
                                <p className={"mt-2"}><Link to="/Login">Увійти</Link></p>
                                <p className={"mt-2"}><Link to="/Register">Зареєструватися</Link></p>
                            </div>
                    }

                    <div className={"d-flex flex-row gap-4"}>
                        <button onClick={toggleTheme} className={"switch-button"}>
                            {theme === "dark" ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                        </button>
                        {
                            user == null ? null : (
                                <button className={"btn rounded-3 w75"} onClick={() => setIsCartOpen(true)}><i className="fa-solid fa-cart-shopping"></i></button>
                            )
                        }
                    </div>
                </div>
            </div>

            <Cart isOpen = {isCartOpen} onClose = {() => setIsCartOpen(false)}/>

        </>
    );
}

export default Header;