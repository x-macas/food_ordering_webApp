import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useFirebase } from "./context/Firebase";
import { onAuthStateChanged } from "firebase/auth";

function Signup() {
    const navigate = useNavigate();
    const firebase = useFirebase();
    const [user, setUser] = useState(null);
    const [credentials, setCredentials] = useState({ fullName: "", email: "", password: "", geolocation: ""});

    useEffect(()=>{
        onAuthStateChanged(firebase.firebaseAuth, (user) => {
            if(user){
                setUser(user);
            }else{{
                setUser(null);
            }}
        })
      },[onAuthStateChanged])
    
      const firebaseAuthentication = async (user) => {
        const response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/oauth", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: user.displayName,
              email : user.email,
              accessToken: user.accessToken,
              authProvider: "google"
            })
        })
    
        if(response.ok){
          localStorage.setItem("profile", user.displayName);
          localStorage.setItem("token", user.accessToken);
          localStorage.setItem("userEmail", user.email);
          navigate("/");
        }
      }
    
      useEffect(() => {
        if (user) {
          // console.log(user);
          firebaseAuthentication(user);
        }
      }, [user, navigate]);  // Runs when user state changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: credentials.fullName,
        password: credentials.password,
        email: credentials.email,
        authProvider: "local",
        location: credentials.geolocation,
      }),
    });

    const json = await response.json();
    console.log(json);
    if(json.success){
        localStorage.setItem('userEmail', credentials.email)
        localStorage.setItem('token', json.authToken);
        navigate("/");
    }else{
        alert("Invalid credentials");
    }
  };

  const onChange = (e) =>{
    setCredentials({...credentials, [e.target.name]:e.target.value});
  }

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <div>
        <Navbar />
      </div>
      <div className="container d-flex flex-column align-items-center mt-5"> 
        <form
          className="w-50 m-auto mt-5 border bg-dark border-success rounded"
          onSubmit={handleSubmit}
        >
          <div className="m-3">
            <label htmlFor="name" className="form-label">
              FullName
            </label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={credentials.fullName}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label">
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
          </div>
           {/* <div className="m-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <fieldset>
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder='"Click below for fetching address"'
                aria-describedby="emailHelp"
              />
            </fieldset>
          </div>  */}
          {/* <div className="m-3">
            <button
              type="button"
              onClick={handleClick}
              name="geolocation"
              className=" btn btn-success"
            >
              Click for current Location{" "}
            </button>
          </div> */}
          <div className="m-3">
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
          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">
            Already a user
          </Link>
        </form>

        <div>or</div>

        <button onClick={()=>{
          firebase.signInWithGoogle()
          }}
          className="m-3 btn btn-success"
        >
          Sign up using Google
          
        </button>

        <button onClick={()=>{
          firebase.signInWithGithub()
          }}
          className="m-3 btn btn-success"
        >
          Sign up using Github
          
        </button>

      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Signup;
