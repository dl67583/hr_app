import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(`http://localhost:3001/api/login`, { username, password });
          localStorage.setItem('token', response.data.token);
          navigate('/users');
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      };

    return (
        <>
            <form onSubmit={handleLogin} className="login-container">
                <div className="input">
                    <p>Username</p>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="input">
                    <p>Password</p>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="login-btn">
                    <button type="submit" name="login">Log in</button>
                </div>
            </form>
        </>
    );

}

export default Login;