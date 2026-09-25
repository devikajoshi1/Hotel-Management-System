import React, { useState } from 'react'
import "./Register.css"
import axios from 'axios';

const Register = () => {
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  const handleRegister = (e) =>{
    e.preventDefault();
    
    const user ={
      name : name,
      email : email,
      password: password,
      role:"USER",

    };

    axios
      .post("http://localhost:8080/api/users/register", user)
      .then((response) => {
        console.log("Registration successful: ",response.data);
        alert("Account created successfully!");
      })
      .catch((error)=>{
        console.log(error);
        alert("Registration failed");
      })

  }

  return (
    <div className='register-page'>
      <div className="register-box">
        <h1>Create Account</h1>
        <p>Join Luxora and start booking your stay.</p>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input
            type='text'
            placeholder='Enter your name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

      <div className="form-group">
          <label>Email</label>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

      <div className="form-group">
          <label>Password</label>
          <input
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>

      <button type='submit' className='register-submit'>
        Create Account
      </button>

      </form>

      </div>
    </div>
  )
}

export default Register
