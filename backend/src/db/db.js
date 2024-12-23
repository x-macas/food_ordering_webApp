const mongoose = require("mongoose");
const DB_NAME = require("../constants.js");

const connectDB = async () => {
    try {
        const dbURI = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(dbURI);
        console.log("MongoDB Connected");

        const fetching_data = mongoose.connection.db.collection("foodItems");
        const data = await fetching_data.find({}).toArray();
        const fetching_catData = mongoose.connection.db.collection("foodCategory");
        const catData = await fetching_catData.find({}).toArray();
        global.food_items = data; 
        global.foodCategory = catData;
        // console.log(global.food_items);
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw err; 
    }
};

module.exports = connectDB;