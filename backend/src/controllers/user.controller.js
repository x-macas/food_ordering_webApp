const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const {validationResult} = require("express-validator");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js"); 
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(User.createStrategy());

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Use async/await instead of a callback
        done(null, user); // Pass the user object to the next middleware
    } catch (err) {
        done(err); // Handle errors properly
    }
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            user.accessToken = accessToken;
            await user.save();
        } else {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                fullName: profile.displayName,
                accessToken: accessToken,
            });
        }

        // Pass user object to Passport
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));



const registerUser = asyncHandler( async(req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).json({ success, errors: errors.array() })
    }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password,salt);

    try {
        const registeredUser = await User.create({
            fullName: req.body.fullName.toLowerCase(),
            password: securePass,
            email: req.body.email,
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
    let user = await User.findOne({email: email});
    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const pwdCompare = await bcrypt.compare(password, user.password); 

    if(!pwdCompare){
        throw new ApiError(401, "Invalid user credentials")
    }

    const data = {
        user: {
            id: user.id,
        },
    };

    const authToken = jwt.sign(data, process.env.TOKEN_SECRET);
    const success = true;
    res.status(201).json({ success, authToken });

});

// const googleOauth = passport.authenticate("google", { scope: ["profile", "email"] });

const handleGoogleRedirect = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true, // Prevents client-side JS access
        secure: process.env.NODE_ENV === "production", // Ensures secure cookie transmission in production
        sameSite: "lax", // Restricts cookie to same-site or top-level navigation
    };

    const accessToken = req.user.accessToken;

    // Set cookie with the defined options
    res.cookie("accessToken", accessToken, options);

    // Redirect to the frontend after setting the cookie
    res.redirect("https://webomato.netlify.app");
});


const googleData = asyncHandler( async(req, res) => {
    const user = req.user;
    const email = user.email;
    const token = user.accessToken;
    if(!email || !token){
        throw new ApiError(400, "email or accessToken is required");
    }
    res.status(201).json(new ApiResponse(200, [email, token], "email and accessToken sent successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true, // Matches the cookie settings used during authentication
        secure: process.env.NODE_ENV === "production", // Same as your cookie settings
        sameSite: "lax", // Or "strict" based on your original configuration
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


module.exports = {registerUser,loginUser, handleGoogleRedirect, googleData, logoutUser};