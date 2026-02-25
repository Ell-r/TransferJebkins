import {Link} from "react-router-dom";
import "./LeftBar.css";

const LeftBar = () =>{
    return(
        <>
            <aside className="admin-sidebar d-flex flex-column align-items-center gap-5  ">
                <ul className="admin-panel">
                    <li><Link to="create-country">Create Country</Link></li>
                    <li><Link to="delete-country">Delete Country</Link></li>
                    <li><Link to="update-country">Update Country</Link></li>
                    <li><Link to="create-city">Create City</Link></li>
                    <li className={"mt-5"}><Link to="/Admin">Countries</Link></li>
                    <li><Link to="users">Users</Link></li>
                </ul>
            </aside>
        </>
    );
}

export default LeftBar;