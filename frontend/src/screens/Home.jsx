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
  }

  useEffect(()=>{
    loadFoodItems();
  },[])


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
                src="https://picsum.photos/id/1/500 "
                className="d-block w-100  "
                style={{ filter: "brightness(30%)", height:"500px", objectFit:"contain !important" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://picsum.photos/id/2/500 "
                className="d-block w-100 "
                style={{ filter: "brightness(30%)", height:"500px", objectFit:"contain !important" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://picsum.photos/id/3/500 "
                className="d-block w-100 "
                style={{ filter: "brightness(30%)",height:"500px", objectFit:"contain !important" }}
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
