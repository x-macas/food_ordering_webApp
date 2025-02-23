const Order = require("../models/order.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");

const displayFoodData = asyncHandler(async(req, res)=>{
    // console.log(global.food_items);
    return res
    .status(200)
    .json(new ApiResponse(200, [global.food_items,global.foodCategory], "Food Data has been sent successfully"));
});

const check_out = asyncHandler( async (req, res) => {
    let data = req.body.order_data;
    data.splice(0,0,{Order_date:req.body.order_date});
    let eId = await Order.findOne({"email": req.body.email});
    if(!eId){
        const updated_data = await Order.create({
            email: req.body.email,
            order_data: [data],
        });
        // console.log(updated_data);

        if(!updated_data){
            throw new ApiError(500, "Something went wrong while storing the order data");
        }

        return res.status(201)
        .json(
            new ApiResponse(200, updated_data, "Order has been placed successfully")
        )
    }else{
        const updated_data = await Order.findOneAndUpdate({email: req.body.email},
            {
                $push: {
                    order_data: data
                }
            }
        )

        //console.log(updated_data);
        
        if(!updated_data){
            throw new ApiError(500, "Something went wrong while storing the order data");
        }

        return res.status(201)
        .json(
            new ApiResponse(200, updated_data, "Order has been placed successfully")
        )

    }
})

const my_orders = asyncHandler(async (req, res) => {
    const data = await Order.findOne({ email: req.body.email });

    if (!data) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No order data found for this user."));
    } else {
        const order = data.order_data.map((orders) => {
            const order_date = orders[0]?.Order_date;

            const order_items = orders.slice(1);

            return {
                orderDate: order_date,
                orderData: order_items,
            };
        });

        return res.status(200).json(
            new ApiResponse(200, order, "Order data retrieved successfully.")
        );
    }
});


module.exports = {displayFoodData, check_out, my_orders};