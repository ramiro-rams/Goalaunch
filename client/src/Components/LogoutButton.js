import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function LogoutButton(){
    const navigate = useNavigate()
    const handleLogout = async () => {
        try{
            await axios.delete('/logout', {withCredentials: true})
            navigate('/login')
        }
        catch(e){
            console.error(e)
        }
    }
    return(
        <button onClick={handleLogout} className="logoutButton">Logout</button>
    )
}