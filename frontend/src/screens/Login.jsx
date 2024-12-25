import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import Navbar from '../components/Navbar';

function Login() {

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({email: "", password: ""});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:9000/api/auth/login", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      })
    });

    const json = await response.json();
    console.log(json);
    if(json.success){
      // console.log(localStorage.getItem("userEmail"));
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('token', json.authToken);
      // console.log(localStorage.getItem("userEmail"));
      navigate("/");
    }else{
      alert("Invalid Credentials");
    }
  }

  const onChange = (e) =>{
    setCredentials({...credentials, [e.target.name]:e.target.value});
  }


  return (
    <div style={{backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
      <div>
        <Navbar />
      </div>
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone.</div>
          </div>
          <div className="m-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/signup" className="m-3 mx-1 btn btn-danger">New User</Link>
        </form>

      </div>
    </div>
  )
}

export default Login