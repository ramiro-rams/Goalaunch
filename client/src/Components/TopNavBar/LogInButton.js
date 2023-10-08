import { Link } from "react-router-dom"
export default function LogInButton() {

    return (
        <Link to="/login">
            <button className="hamburgerMenuPanelButton">Log In</button>
        </Link>
    )
}