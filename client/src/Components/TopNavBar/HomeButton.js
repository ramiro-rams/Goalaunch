import { useNavigate } from "react-router-dom"
export default function HomeButton(){
const navigate = useNavigate()
    const handleRedirect = () => {
        navigate('/')
    }
    return(
        <button className="homeButton" onClick={handleRedirect}>Home</button>
    )
}