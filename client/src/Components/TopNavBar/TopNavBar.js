import HamburgerMenu from "./HamburgerMenu";
import { useNavigate } from "react-router-dom"

export default function TopNavBar() {
    const navigate = useNavigate()
    return (
        <div className="topNavBar">
            <h1 onClick={() => navigate('/')}>Goalaunch</h1>
            <HamburgerMenu/>
        </div>
    )
}