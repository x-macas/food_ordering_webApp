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

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
                My Orders
            </h1>
            {!(orders && orders.length) ? (
                <p className="text-center text-gray-600 text-lg mt-12">
                    No orders found.
                </p>
            ) : (
                <div className="space-y-10">
                    {orders.map((order, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-6 shadow-lg bg-white transform transition duration-300 hover:scale-105"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                                Order Date: {order.orderDate}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {order.orderData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-lg p-4 shadow-md bg-gray-50 flex items-start gap-6 transform transition duration-300 hover:shadow-xl"
                                    >
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-28 h-28 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Size: {item.size}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.qty}
                                            </p>
                                            <p className="text-lg font-medium text-gray-800">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
