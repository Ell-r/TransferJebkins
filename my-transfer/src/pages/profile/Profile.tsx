import "./Profile.css";
import {useAppDispatch, useAppSelector} from "../../store";
import {useNavigate} from "react-router-dom";
import {logout} from "../../services/authSlice.ts";

const Profile = () => {

    const user =
        useAppSelector(redux => redux.auth.user);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    if (!user) {
        return (
            <div className="profile container mt-5 text-center">
                <h4>Ви не авторизовані</h4>
                <button
                    className="btn border border-grey w-25 mt-3"
                    onClick={() => navigate("/login")}>
                    Увійти
                </button>
            </div>
        );
    }

    const handleLogout = () => {
        appDispatch(logout());
        navigate("/Login");
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto p-4 profile" style={{ maxWidth: 400 }}>
                <div className="text-center">
                    {user.image && (
                        <img
                            src={user.image ? `http://3.123.20.53:5898/images/${user.image}` : "/default-avatar.png"}
                            alt="image"
                            className="rounded-circle mb-3"
                            width={100}
                        />
                    )}
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                </div>

                <hr/>

                <button className="btn btn-outline-danger mt-3 w-100" onClick={handleLogout}>Вийти</button>
            </div>
        </div>
    );
};

export default Profile;