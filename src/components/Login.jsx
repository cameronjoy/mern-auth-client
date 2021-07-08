import{useState} from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import {Redirect} from 'react-router-dom'
import Profile from './Profile'

export default function Login(props) {
    //state for control form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //state for flash messages from the backend
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            console.log('do axios')
            //post to backend with axios
            const requestBody = {
                email: email,
                password: password
            }
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`, requestBody)

            console.log(response)

            const { token } = response.data
    
            //save response to local storage
            localStorage.setItem('jwtToken', token )

            //decode the jwt token before we put in state
            const decoded = jwt.decode(token)

            //set the user in app.js state
            props.setCurrentUser(decoded)

        } catch (err) {
            if(err.response.status === 400){
                setMessage(err.response.data.msg)
            }else {
                console.log(err)
            }
            
        }
       
    }

    if(props.currentUser) {
        return(
            <Redirect to='/profile' component={Profile} currentUser={props.currentUser} />
        )
    }

    return (
        <div>
            <h3>Login To Your Account!</h3>
            <p>{message}</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor={'email-input'}>email:</label>

                <input 
                id='email-input' 
                type="email" 
                placeholder='user@domain.com' 
                onChange={e => setEmail(e.target.value)}
                value={email} 
                />

                <label htmlFor={'password-input'}>password:</label>

                <input 
                type="password" 
                id='password-input'
                placeholder='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                />

                <input type="submit" 
                value='login'
                />

            </form>
        </div>
    )
}