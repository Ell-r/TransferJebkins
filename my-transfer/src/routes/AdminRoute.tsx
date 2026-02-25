import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";

const AdminRoute = () => {
    const user = useAppSelector(state => state.auth.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];


    if (roles.includes("Admin")) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;