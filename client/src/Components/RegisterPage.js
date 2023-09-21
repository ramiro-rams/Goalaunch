import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function RegisterPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [passwordIsHidden, setPasswordIsHidden] = useState(true)
    const [invalidUsername, setInvalidUsername] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const validCharacters = /^[a-z0-9.]+$/
        const maxUsernameLength = 30
        //resetting states set by previous submit
        setPasswordsMatch(true)
        setInvalidUsername(false)
        setUsernameTaken(false)
        setIsPasswordValid(true)
        const isUsernameValid = (username) =>{
            if(validCharacters.test(username) && username.length <= maxUsernameLength && username.length > 0)
                return true
            else
                return false
        }
        const isPasswordValid = (password) => {
            if (password.length < 8)
                return false;
              // Check for at least three of the following character types
              let charTypes = 0
              // Uppercase letters
              if (/[A-Z]/.test(password))
                charTypes++
              // Lowercase letters
              if (/[a-z]/.test(password))
                charTypes++
              // Numbers
              if (/\d/.test(password)) 
                charTypes++
              // Special symbols (you can customize this character class)
              if (/[\W_]/.test(password)) {
                charTypes++
              }
              return charTypes >= 3;
        }
        if(isUsernameValid(username)){
            if(password === confirmedPassword){
                if(isPasswordValid(password)){
                    try{
                        const response = await axios.post('/register', {
                            username: username,
                            password: password
                        })
                        if(response.status === 201){
                            navigate('/login')
                        }
                    }
                    catch(e){
                        if(e.response.status === 409){
                            setUsernameTaken(true)
                        }
                    }                    
                }
                else
                    setIsPasswordValid(false)
            }
            else
                setPasswordsMatch(false)
        }
        else
            setInvalidUsername(true)
    }
    return (
        <div className='registerPage'>
            <form className='registerForm' onSubmit={(e)=>handleSubmit(e)}>
                <h1>GOALAUNCH</h1>
                    <input  className='registerInput' type="text" name="username" required placeholder='Choose Username' onChange={(e)=>setUsername(e.target.value)}/>
                    <div className='registerInputContainer'>
                        <input  className='registerInput' type={passwordIsHidden ? 'password' : 'text'} name="password" required placeholder='Choose Password' onChange={(e)=>setPassword(e.target.value)}/>
                        {password.length > 0 ? <button type='button' tabIndex='-1' onClick={()=>setPasswordIsHidden(prev => !prev)}>{passwordIsHidden ? 'Show' : 'Hide'}</button> : ''}
                    </div>
                    <div className='registerInputContainer'>
                        <input  className='registerInput' type={passwordIsHidden ? 'password' : 'text'} required placeholder='Confirm Password' onChange={(e) => setConfirmedPassword(e.target.value)}/>
                        {confirmedPassword.length > 0 ? <button type='button' tabIndex='-1' onClick={()=>setPasswordIsHidden(prev => !prev)}>{passwordIsHidden ? 'Show' : 'Hide'}</button> : ''}
                    </div>
                    <div className='passwordRequirements'>
                        <span>Password requirements:</span>
                        <ul>
                            <li>At least 8 characters long</li>
                            <li>Meets 3 of the following requirements:</li>
                            <ul>
                                <li>Contains an uppercase letter</li>
                                <li>Contains a lowercase letter</li>
                                <li>Contains a number</li>
                                <li>Contains special character e.g., '!', '#', '^' etc</li>
                            </ul>
                        </ul>
                    </div>
                {passwordsMatch ? '' : <span className='registerErrorMessage'>Passwords do not match</span>}
                {invalidUsername ? <span className='registerErrorMessage'>Username must contain only lower case letters, numbers, and periods</span> : ''}
                {usernameTaken ? <span className='registerErrorMessage'>Username is already taken</span> : ''}
                {isPasswordValid ? '' : <span className='registerErrorMessage'>Password does not meet requirements</span>}
                <button className='registerSubmitButton' type='submit'>Register</button>
            </form>
            <div>
                <div></div>
                <span>OR</span>
                <div></div>
            </div>
            <a href="/login" >Login</a>
        </div>
    )
}
