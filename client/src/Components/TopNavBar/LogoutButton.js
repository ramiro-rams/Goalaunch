import axios from "axios"
import { useNavigate } from "react-router-dom"
export default function LogoutButton(){
    const navigate = useNavigate()
    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?")
        if(confirmed){
            try{
                await axios.delete('/auth/logout', {withCredentials: true})
                navigate('/login')
            }
            catch(e){
                console.error(e)
            }
        }
    }
    return(
        <button onClick={handleLogout} className="logoutButton">Logout</button>
    )
}