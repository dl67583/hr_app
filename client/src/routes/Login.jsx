import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Ensure the path is correct

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();  // Use navigate to redirect

  const handleLogin = async () => {
    try {
      await login(username, password);  // Call the login function from AuthContext
      navigate('/dashboard');  // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., show error message)
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
