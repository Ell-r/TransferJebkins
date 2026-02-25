import './App.css'
import Header from "./pages/header/Header.tsx";
import {Outlet} from "react-router-dom";

function App() {

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default App
