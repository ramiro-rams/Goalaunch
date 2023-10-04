import {useState, useRef, useEffect} from 'react'
import LogoutButton from './LogoutButton'
import HomeButton from './HomeButton'
export default function HamburgerMenu(){
    const [menuToggle, setMenuToggle] = useState(false)
    const menuPanel = useRef(null)
    const menu = useRef(null)
    useEffect(()=>{
        const handleClickOutsideMenuPanel = (event) => {
            if(menuPanel.current && !menu.current.contains(event.target)){
                setMenuToggle(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutsideMenuPanel)
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMenuPanel)
        }
    }, [])
        const handleMenuToggle = () => {
            setMenuToggle(prev=>!prev)
        }
    return(
        <div ref={menu}className='hamburgerMenu'>
            <button onClick={handleMenuToggle}><img src='hamburger-menu-svgrepo-com.svg' alt=''></img></button>
            {menuToggle ? 
            <div ref={menuPanel}>
                <HomeButton/>
                <LogoutButton/>

            </div> : ''}
        </div>
    )
}