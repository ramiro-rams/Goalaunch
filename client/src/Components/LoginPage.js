import {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function LoginPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [incorrectCredentials, setIncorrectCredentials] = useState(false)
    const [passwordIsHidden, setPasswordIsHidden] = useState(true)
    const navigate = useNavigate()
    useEffect(()=>{
        checkAuthentication()
    }, [])

    const checkAuthentication = async () => {
        try{
            const res = await axios.get('/auth/checkAuth', {withCredentials: true})
            if(res.status === 200){
                navigate('/goals')
            }
        }catch(err){
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post('/auth/login', {
                username: username,
                password: password
            },{withCredentials: true})
            if(response.status === 200){
                //this stores all the goals the user created while loged out in the database
                const goalsArray = JSON.parse(localStorage.getItem('goals'))
                const unsavedGoals = goalsArray.filter((goal) => goal._id === null)
                for(const goal of unsavedGoals){
                    try{
                        await axios.post('/goals/insertGoal', {newGoal: goal.goalName}, {withCredentials: true})
                    }catch{
                    }
                }
                navigate('/goals')
            }
        }catch(e){
            setIncorrectCredentials(true)
        }
    }
    
    const togglePasswordVisibility = () => {
        setPasswordIsHidden(prev => !prev)
    }
    return(
        <div className='loginContainer'>
            <form className='loginForm' onSubmit={(e)=>handleSubmit(e)}>
                <h1>GOALAUNCH</h1>
                <input className='loginInput' aria-label='Username' placeholder='Username' type="text" id="username" name="username" onChange={(e)=>{setUsername(e.target.value)}}required/>
                <div className='inputContainer'>
                    <input className='loginInput' aria-label='Password' placeholder='Password' type={passwordIsHidden ? "password" : "text"} id="password" name="password" onChange={(e)=>{setPassword(e.target.value)}}required/>
                    {password.length > 0 && <button  onClick={togglePasswordVisibility} className='showPasswordButton' type='button'>{passwordIsHidden ? "Show" : "Hide"}</button>}
                </div>
                {incorrectCredentials && <span>Incorrect username or password</span>}
                <button className='submitButton' type="submit">Login</button>
            </form>
            <div>
                <div></div>
                <span>OR</span>
                <div></div>
            </div>
            <a href="/register">Register</a>
        </div>
    )
}