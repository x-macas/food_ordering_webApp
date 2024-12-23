const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const {validationResult} = require("express-validator");
const ApiError = require("../utils/ApiError.js");

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
})

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

})

module.exports = {registerUser,loginUser};