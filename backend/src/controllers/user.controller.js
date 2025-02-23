const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const {validationResult} = require("express-validator");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js"); 
const passport = require("passport");



// const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// const googleCallback = (req, res, next) => {
//     passport.authenticate("google", { failureRedirect: "https://webomato.netlify.app/login" }, 
//     (err, user, info) => {
//       if (err) return next(err);
//       if (!user) return res.redirect("https://webomato.netlify.app/login");
  
//       // Log the user in and redirect
//       req.logIn(user, (err) => {
//         if (err) return next(err);
//         res.redirect("https://webomato.netlify.app");
//       });
//     })(req, res, next);
// };


// const getUser = (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     res.json(req.user);
// };


const oauthUser = asyncHandler( async(req, res,next) => {
    //console.log(req.body);
    const {fullName, email, accessToken, authProvider} = req.body

    if(
        [fullName, email, accessToken, authProvider].some((field) => field?.trim()==="")
    ){
        return res.status(404).json({message: "All fields are required"});
    }

    const oauthClient = await User.create({
        email: email,
        fullName: fullName,
        authProvider: authProvider,
        accessToken: accessToken
    })

    if(!oauthClient){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(200).json({message: "Registration done successfully"});

})

const oauthLoginUser = asyncHandler( async (req,res,next) => {
    const {fullName, email, accessToken, authProvider} = req.body

    if(
        [fullName, email, accessToken, authProvider].some((field) => field?.trim()==="")
    ){
        return res.status(404).json({message: "All fields are required"});
    }

    const curr_user = await User.findOne({email: email});

    if(!curr_user){
        throw new ApiError(404, "user does not exist");
    }
})



const registerUser = asyncHandler( async(req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).json({ success, errors: errors.array() })
    }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password,salt);

    try {
        const registeredUser = await User.create({
            email: req.body.email,
            fullName: req.body.fullName.toLowerCase(),
            password: securePass,
            authProvider: req.body.authProvider,
            location: req.body.location,
        });

        if(!registerUser){
            throw new ApiError(500, "Something went wrong while registering the user")
        }

        const data = {
            registeredUser: {
                id: registeredUser.id,
            },
        };

        const authToken = jwt.sign(data, process.env.TOKEN_SECRET);
        const success = true;
        res.status(201).json({ success, authToken });
    } catch (err) {
        next(err); 
    }
});

const loginUser = asyncHandler( async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new ApiError(400, "Please enter valid credentials", errors.array());
    }

    const {email, password} = req.body;
    // console.log(password);
    let user = await User.findOne({email: email});
    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const pwdCompare = await bcrypt.compare(password, user.password); 
    //console.log(pwdCompare);

    if(!pwdCompare){
        throw new ApiError(401, "Invalid user credentials")
    }

    const data = {
        user: {
            id: user.id,
        },
    };

    const options = {
        httpOnly: true, // Prevents client-side access
        secure: true, // Ensures cookies are sent over HTTPS
        sameSite: "none", // Allows cross-site requests
        // domain: ".render.com", // Set this to the backend's domain
    }; 

    const authToken = jwt.sign(data, process.env.TOKEN_SECRET);
    const success = true;
    res.status(201).cookie("authToken", authToken, options).json({ success, authToken });

});




const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true, // Matches the cookie settings used during authentication
        secure: process.env.NODE_ENV === "production", // Same as your cookie settings
        sameSite: "none", // Or "strict" based on your original configuration
    };

    // Clear the cookie
    res.clearCookie("accessToken", options);

    // Optionally destroy the session if using express-session
    req.session?.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
        }
    });

    // Send a response confirming logout
    res.status(200).json({ message: "Logout successful" });
});


module.exports = {registerUser,loginUser, logoutUser, oauthUser, oauthLoginUser};