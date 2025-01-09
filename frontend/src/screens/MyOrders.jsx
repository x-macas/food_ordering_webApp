import React, { useState, useEffect } from "react";

function MyOrders() {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        let response = await fetch("https://dipteshs-food-ordering-webapp.onrender.com/api/data/myOrders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: localStorage.getItem("userEmail"),
            }),
        });

        response = await response.json();
        console.log(response);
        setOrders(response.data);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // console.log(localStorage.getItem("email"));

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">My Orders</h1>
            {!(orders && orders.length) ? (
                <p className="text-center text-muted">No orders found.</p>
            ) : (
                <div className="row">
                    {orders.map((order, index) => (
                        <div key={index} className="col-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    Order Date: {order.orderDate}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {order.orderData.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="col-sm-6 col-md-4 mb-3"
                                            >
                                                <div className="card">
                                                    <img
                                                        src={item.img}
                                                        alt={item.name}
                                                        className="card-img-top img-fluid"
                                                        style={{ height: "200px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">
                                                            {item.name}
                                                        </h5>
                                                        <p className="card-text">
                                                            Size: {item.size}
                                                        </p>
                                                        <p className="card-text">
                                                            Quantity: {item.qty}
                                                        </p>
                                                        <p className="card-text font-weight-bold">
                                                            &#8377;{item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
