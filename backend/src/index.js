require('dotenv').config();
const connectDB = require("./db/db.js");
const app = require("./app.js");

connectDB().then(()=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`server is running at port : ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("MongoDB connection failed !!!!!", err);
})
