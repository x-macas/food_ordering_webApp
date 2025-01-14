import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useCart } from "./contextReducer.jsx";
import Cart from "../screens/Cart.jsx";
import Modal from "../screens/Modal.jsx";
// import Cookie from "js-cookie";

function Navbar() {
  const data = useCart();
  const [accessToken, setAccessToken] = useState(null);
  const [cartView, setCartView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track location changes


  const fetchGoogleAuthData = async () => {
    const response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/google/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    if(response.ok){
      const json = await response.json();
      localStorage.setItem("userEmail", json.data[0]);
      localStorage.setItem("token", json.data[1]);
      setAccessToken(localStorage.getItem("token"));
    }
  };

  // useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      setAccessToken(token);
    } else {
      fetchGoogleAuthData();
    }
  // },[]);

  const handleLogOut = async () => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token");
  
      const response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed", response.status, response.statusText);
      }
      setAccessToken(null);
      navigate("/login");
  };
  console.log(accessToken);
  console.log(localStorage.getItem("userEmail"));

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-success position-sticky"
        style={{
          boxShadow: "0px 10px 20px black",
          position: "fixed",
          zIndex: "10",
          width: "100%",
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
            Webomato
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 mx-3 active"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {accessToken && (
                <li className="nav-item">
                  <Link
                    className="nav-link fs-5 mx-3 active"
                    aria-current="page"
                    to="/myOrders"
                  >
                    My Orders
                  </Link>
                </li>
              )}
            </ul>
            {accessToken ? (
              <div>
                <div
                  className="btn bg-white text-success mx-2"
                  onClick={() => setCartView(true)}
                >
                  My Cart{" "}
                  <Badge pill bg="danger">
                    {data && data.length > 0 ? data.length : null}
                  </Badge>
                </div>
                {cartView && (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart />
                  </Modal>
                )}
                <button
                  onClick={handleLogOut}  
                  className="btn bg-white text-success"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form className="d-flex">
                <Link className="btn bg-white text-success mx-1 " to="/login">
                  Login
                </Link>
                <Link className="btn bg-white text-success mx-1" to="/signup">
                  Signup
                </Link>
              </form>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
