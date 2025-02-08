import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useFirebase } from "./context/Firebase";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [invalid, setInvalid] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://dipteshs-food-ordering-webapp.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        setInvalid(true);
        throw new Error('Invalid Credentials');
      }

      const json = await response.json();
      console.log(json);

      if (json.success) {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('token', json.authToken);
        navigate('/');
      } else {
        setInvalid(true);
        // alert('Invalid Credentials');
      }
    } catch (error) {
      setInvalid(true);
      console.error('Login failed:', error.message);
      // alert(error.message);
    }
  };

  useEffect(()=>{
    onAuthStateChanged(firebase.firebaseAuth, (user) => {
        if(user){
            setUser(user);
        }else{{
            setUser(null);
        }}
    })
  },[onAuthStateChanged])

  useEffect(() => {
    if (user) {
      // console.log(user);
      localStorage.setItem("profile", user.displayName);
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("userEmail", user.email);
      navigate("/");
    }
  }, [user, navigate]);  // Runs when user state changes
  


  // useEffect(() => {
  //   fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/user", {
  //     method: "GET",
  //     credentials: "include", // Ensures cookies (session) are sent
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user data");
  //       }
  //       return response.json();
  //     })
  //     .then(data => setUser(data))
  //     .catch(error => console.log("Error fetching user:", error));
  // }, []);

  // console.log(user);
  

  // const handleGoogle = () => {
  //   window.location.href = "https://dipteshs-food-ordering-webapp.onrender.com/api/auth/google";
  // };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        height: '100vh',
        backgroundSize: 'cover',
      }}
    >
      <Navbar />
      {
        !user &&  (
          <div className="container d-flex flex-column align-items-center mt-5">
        {/* Login Form */}
        <form
          className="w-50 border bg-dark border-success rounded p-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              name="password"
            />
          </div>
          <button type="submit" className="btn btn-success me-2">
            Submit
          </button>
          <Link to="/signup" className="btn btn-danger">
            New User
          </Link>
        </form>

        <button onClick={()=>{
          firebase.signInWithGoogle()
          }}
           className="m-3 btn btn-success"
        >
          Google Sign In
          
        </button>

        {/* Extra Content Div BELOW the Form */}
        {
          invalid && (
            <div className="alert alert-danger d-flex flex-column align-items-start p-3 mt-3 rounded">
              <p className="mb-1">Sorry, unrecognized credentials.</p>
            </div>
          )
        }
      </div>
        )
      }

    </div>
  );
}

export default Login;
