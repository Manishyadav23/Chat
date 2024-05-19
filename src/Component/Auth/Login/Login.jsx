import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../server/firebase';
import { useNavigate } from 'react-router-dom';

import './Login.css'

function Login() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      console.log("current user is :",auth.currentUser);
      console.log('User successfully logged in');
      console.log(formData.email+" "+formData.password);
      
      // window.location.href = '/Home'; 
      navigate('/Home'); 
    } catch (error) {
      console.error('Error logging in:', error.message); 
      alert("Invalid email or password");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container">
        <img src="https://images.unsplash.com/photo-1607194402064-d0742de6d17b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        <div className="bcontainer">
          <div className="R-head">
            <h1>Login for ChatApp</h1>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="username">
                <input
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="username">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="button">
                <button type="submit">Submit</button>
              </div>
              <dic className="fpass">
                <Link to="/forgetpassword" style={{color:"white"}}>Forget Password</Link>
              </dic>
              <div className="R-down">
                <h4>Not an account? <Link to="/Register" style={{color:"white"}}>Register</Link></h4>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
