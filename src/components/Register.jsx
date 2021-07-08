import {useState} from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import {Redirect} from 'react-router-dom'
import Profile from './Profile.jsx'

export default function Register(props) {
    //state for the controlled form
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //state for the flash message from the server
    const [message, setMessage] = useState('')

    //function to handle form submission
    const handleSubmit = async e => {
        try {
            e.preventDefault()
            //make a request body
            const requestBody = {
                name: name,
                email: email,
                password: password
            }
    
            //post registration data to server
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/register`, requestBody)
    
            //take the token out of the response
            const {token} = response.data
    
            //decode the token
            const decoded = jwt.decode(token)

            //set token in localStorage
            localStorage.setItem('jwtToken', token)
    
            //set the user in the app.js state
            props.setCurrentUser(decoded)

        } catch(err) {
            //set message
            if(err.response.status === 400){
                setMessage(err.response.data.msg)
            } else{
                console.log(err)
            }
        }
       
        console.log('submit the form!')
    }

    //redirect if the user is logged in
    if(props.currentUser) {
        return(
            <Redirect to='/profile' component={Profile} currentUser={props.currentUser} />
        )
    }

    return (
        <div>
            <h3>Registration form:</h3>
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" 
                id='name-input'
                placeholder='Enter Name Here'
                onChange={e => setName(e.target.value)}
                value={name}/>

                <label htmlFor="email">Email:</label>
                <input type="email" 
                id='email-input'
                placeholder='Enter Email Here'
                onChange={e => setEmail(e.target.value)}
                value={email}/>

                <label htmlFor="password">Password:</label>
                <input type="password" 
                id='password-input'
                placeholder='Enter Password Here'
                onChange={e => setPassword(e.target.value)}
                value={password}/>
                
                <input type="submit" 
                value='make new account'/>

            </form>
        </div>
    )
}