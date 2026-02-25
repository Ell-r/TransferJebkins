import {Outlet} from "react-router-dom"
import LeftBar from "../components/LeftBar.tsx";

const AppLayout = () => {
    return (
        <div className="d-flex ">

            <LeftBar/>

            <main className="w-75">
                <Outlet />
            </main>
        </div>
    );
}
export default AppLayout;