import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";
import { useAuth } from '../context/AuthContext';  // Ensure the path is correct

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();  // Use navigate to redirect

  // const handleLogin = async () => {
  //   try {
  //     await login(username, password);  // Call the login function from AuthContext
  //     navigate('/dashboard');  // Redirect to dashboard after successful login
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     // Handle login failure (e.g., show error message)
  //   }
  // };

  return (
    <div className='login-container'>
      <div className='input'>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div className='input'>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <div className='login-btn'>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Login;
