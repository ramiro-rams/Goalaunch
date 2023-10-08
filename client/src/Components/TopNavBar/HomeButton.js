import { Link } from "react-router-dom"
export default function HomeButton(){
    return(
        <Link to="/">
            <button className="hamburgerMenuPanelButton" >Home</button>
        </Link>
    )
}