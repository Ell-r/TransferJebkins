import "./CardComponent.css";
import {Link} from "react-router-dom";
import "../component.css";

interface Props {
    id: number;
    image: string;
    name: string;
    path: string;
}

const CardComponent: React.FC<Props> = ({id, image, name, path}) =>{
    return(
        <>
            <div className = "info-card" key = {id}>
                <img src = {image} alt = {name}  width={450} height={300} />

                <div className = "info-card-overlay">
                    <h2>{name}</h2>
                    <Link to ={path}>Дізнатися більше</Link>
                </div>
            </div>
        </>
    );
}

export default CardComponent;