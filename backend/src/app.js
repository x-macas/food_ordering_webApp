const express = require("express");
const userRouter = require("./routes/user.routes.js");
const foodDataRouter = require("./routes/foodDataroutes.js");
const app = express();

// configurations for app
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
// another way to handle cors error
app.use((req, res, next) => {
    res.setHeader("Access-control-allow-origin", "https://webomato.netlify.app");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        // Handle preflight request
        res.sendStatus(200);
    } else {
        next();
    }
})

app.use("/api/auth", userRouter);
app.use("/api/data", foodDataRouter);

module.exports = app; 