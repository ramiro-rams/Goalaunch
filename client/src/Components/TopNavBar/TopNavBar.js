import HamburgerMenu from "./HamburgerMenu"
import { useNavigate } from "react-router-dom"

export default function TopNavBar({authenticated, setAuthenticated}) {
    const navigate = useNavigate()
    return (
        <div className="topNavBar">
            <h1 onClick={() => navigate('/')}>Goalaunch</h1>
            <HamburgerMenu authenticated={authenticated} setAuthenticated={setAuthenticated}/>
        </div>
    )
}