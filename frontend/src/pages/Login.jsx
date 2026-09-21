import { useState } from 'react';
import "./Login.css";

const Login = () => {
  const[email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) =>{
    e.preventDefault();

    console.log("Email:" ,email);
    console.log("Password:",password);
  }
  return (
    <div className='login-page'>
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p>Login to continue your hotel booking</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          </div>

          <button type='submit' className="login-submit">
            Login
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
