import axios from "axios"
export default function LogoutButton({setAuthenticated, setMenuToggle}){
    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?")
        if(confirmed){
            try{
                await axios.delete('/auth/logout', {withCredentials: true})
                setAuthenticated(false)
                setMenuToggle(false)
            }
            catch(e){
                console.error(e)
            }
        }
    }
    return(
        <button className="hamburgerMenuPanelButton" onClick={handleLogout}>Logout</button>
    )
}