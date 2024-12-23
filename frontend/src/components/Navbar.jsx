import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
import {useCart} from "./contextReducer.jsx";
import Cart from "../screens/Cart.jsx";
import Modal from "../screens/Modal.jsx";


function Navbar() {
    const data = useCart();
    const [cartView, setCartView] = useState(false);
    const navigate = useNavigate();
    const handleLogOut = () => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token"); 
      navigate("/login");
    }
    return (
      <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success position-sticky"
          style={{ boxShadow: "0px 10px 20px black", filter: 'blur(20)', position: "fixed", zIndex: "10", width: "100%" }}>
          <div className="container-fluid">
              <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                          <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/">Home</Link>  {/* index.css - nav-link color white */}
                      </li>
                      {(localStorage.getItem("token")) ?
                          <li className="nav-item">
                              <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/myOrders" >My Orders</Link>  {/* index.css - nav-link color white */}
                          </li> : ""
                      }
                  </ul>
                  {(!localStorage.getItem("token")) ?
                      <form className="d-flex">
                          <Link className="btn bg-white text-success mx-1 " to="/login">Login</Link>
                          <Link className="btn bg-white text-success mx-1" to="/signup">Signup</Link>
                      </form> :
                      <div>

                          <div className="btn bg-white text-success mx-2 " onClick={()=>{setCartView(true)}} >
                              My Cart {" "}
                              <Badge pill bg ="danger" >
                              {
                                data && data.length>0 ? data.length: null
                              }
                               </Badge>
                          </div>
                        {/* <Modal /> This is only used when Modal doesn't expect children and simply renders independently
                        otherwise use <Modal></Modal> */}
                          {cartView ? <Modal onClose={() => setCartView(false)}><Cart/></Modal> : null}

                          <button onClick={handleLogOut} className="btn bg-white text-success" >Logout</button></div>}
              </div>
          </div>
      </nav>
  </div>
    );
  }

  export default Navbar;
