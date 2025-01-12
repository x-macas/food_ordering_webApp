import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Card from "../components/Card.jsx";
import { use } from "react";
function Home() {
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const loadFoodItems = async () => {
    let response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/data/foodData",{
      method: "GET",
      headers:{
        'content-Type': "application/json",
      }
    });

    response = await response.json();
    setFoodItems(response.data[0]);
    setFoodCat(response.data[1]);
  };
  
  const fetchGoogleAuthData = async () => {
      const response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/auth/google/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const json = await response.json();
      localStorage.setItem("userEmail", json.data[0]);
      localStorage.setItem("token", json.data[1]);
  };


  useEffect(()=>{
    loadFoodItems();
    fetchGoogleAuthData();
  },[]);


  // console.log(localStorage.getItem("userEmail"));

  return (
    <>
      <Navbar />
      <div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade "
          data-bs-ride="carousel"
        >
          <div className="carousel-inner " id="carousel">
            <div className=" carousel-caption  " style={{ zIndex: "9" }}>
              <div className=" d-flex justify-content-center">
                {" "}
                <input
                  className="form-control me-2 w-75 bg-white text-dark"
                  type="search"
                  placeholder="Search in here..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <button
                  className="btn text-white bg-danger"
                  onClick={() => {
                    setSearch("");
                  }}
                >
                  X
                </button>
              </div>
            </div>
            <div className="carousel-item active">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/015/933/115/small_2x/chole-bhature-is-a-north-indian-food-dish-a-combination-of-chana-masala-and-bhatura-or-puri-free-photo.jpg"
                className="d-block w-100  "
                style={{ filter: "brightness(30%)", height:"700px", objectFit:"contain !important" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://paattiskitchen.com/wp-content/uploads/2023/04/kmc_20230401_003949-1.jpg"
                className="d-block w-100 "
                style={{ filter: "brightness(30%)", height:"700px", objectFit:"contain !important" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://cdn.sanity.io/images/cctd4ker/production/9dfaeda73538877faf9c927ec8c8d6863c2c2111-4800x3200.jpg?w=3840&q=75&fit=clip&auto=format"
                className="d-block w-100 "  
                style={{ filter: "brightness(30%)",height:"700px", objectFit:"contain !important" }}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container">
        {
          foodCat && foodCat.length>0 ?
          foodCat.map((data) => {
            return (
              <div className='row mb-3'>
                <div key = {data.id} className='fs-3 m-3'>
                  {data.CategoryName}
                </div>
                <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                {
                  foodItems.length>0?
                  foodItems.filter(
                    (item) => ((item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLowerCase())))
                  ).map((filterItem)=>{
                    return(
                      <div key={filterItem.id} className='col-12 col-md-6 col-lg-3'>
                        {/* {console.log(filterItem.url)} */}
                        <Card foodName={filterItem.name} item={filterItem} options={filterItem.options[0]} ImgSrc={filterItem.img} ></Card>
                      </div>
                    )
                  }):<div>No Such Data</div>
                }
              </div>
            )
          }):""
        }
      </div>

      <Footer />
    </>
  );
}

export default Home;
