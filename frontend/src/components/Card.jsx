import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import {useCart, useDispatchCart} from "./contextReducer.jsx"


function Card(props) {

  const data = useCart();
  let navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const priceRef = useRef(); 
  const dispatch = useDispatchCart();
  let foodItem = props.item;

  let options = props.options;
  let priceOptions = Object.keys(options);

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login")
    }
  }
  const handleQty = (e) => {
    setQty(e.target.value);
  }
  const handleOptions = (e) => {
    setSize(e.target.value);
  }

  const handleAddToCart = async () => {

    if (!Array.isArray(data)) {
      console.error("useCart() did not return an array");
      return;
    }

    let food = [];
    for (const item of data){
      if(item.id==foodItem._id && item.size==size){
        food = item;
        break;
      }
    }

    // if(food !== []){
    //   This will always be true as arrays in javascript are reference types,
    //   so two separate arrays are never considered equal even if they contain the same elements.
    // }
    // console.log(food.length);
    if (!(!(food) || food.length===0)) { // dimaag kharab kar diya h ye :(
      if (food.size === size) {
        console.log("Hola");
        await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty });
      } else {
        // console.log("Hola");
        await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: foodItem.img });
      }
      // console.log("Holah");
    }else {
      await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: foodItem.img });
      return;
    }

  }



  useEffect(()=>{
    setSize(priceRef.current.value);
  },[]);

  let finalPrice = qty * parseInt(options[size]); 

  return (
    <div>

      <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
        <img src={props.ImgSrc} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
        <div className="card-body">
          <h5 className="card-title">{props.foodName}</h5>
          <p className="card-text">This is some random text. This is description.</p>
          <div className='container w-100 p-0' style={{ height: "38px" }}>
            <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }} onClick={handleClick} onChange={handleQty} >
              {Array.from(Array(6), (e, i) => {
                return (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>)
              })}
            </select>
            <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }} ref={priceRef} onClick={handleClick} onChange={handleOptions}>
              {priceOptions.map((i) => {
                return <option key={i} value={i}>{i}</option>
              })}
            </select>
            <div className=' d-inline ms-2 h-100 w-20 fs-5' >
              ₹{finalPrice}/-
            </div>
          </div>
          <hr></hr>
          <button onClick={handleAddToCart} className={`btn btn-success justify-center ms-2 `}>Add to Cart</button>
          {/* <button className={`btn btn-danger justify-center ms-2 ${btnEnable ? "" : "disabled"}`} onClick={handleRemoveCart}>Remove</button> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
