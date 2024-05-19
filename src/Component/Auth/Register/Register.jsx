import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; 

import { auth } from '../../../server/firebase';

function Register() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    imgurl: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(auth.currentUser, {
          displayName: formData.username,
          photoURL:`http://gravatar.com/avatar/${auth.currentUser.uid}?d=identicon`
        });

        const { id, photoURL, displayName } = auth.currentUser;
        navigate("/home", {state:{id:id,photo:photoURL, name:displayName}});
        console.log("id is "+id);
        
        const db = getDatabase();
        await set(ref(db, 'users/' + userCredential.user.uid), {
          username: formData.username,
          email: formData.email,
          imgurl: photoURL,
        });

        console.log('User registered:', userCredential.user);
        console.log('Form submitted:', formData);
      } catch (error) {
        console.error('Error registering user:', error.message);
        alert("user is already present")
      }
    } else {
      console.log('Form contains errors. Please correct them.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  return (
    <>
      <div className="container">
        <div className="bcontainer">
          <div className="R-head">
            <h1>Register for ChatApp</h1>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="username">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>
              <div className="username">
                <input
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="username">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              <div className="username">
                <input
                  type="password"
                  placeholder="Password Confirmation"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>

              <div className="button">
                <button type="submit">Submit</button>
              </div>
              <div className="R-down">
                <h4>Already a user? <Link to="/Login" style={{color:"white"}}>Login</Link></h4>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
