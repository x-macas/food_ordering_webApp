const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");

const verifyToken = asyncHandler(async(req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies?.accessToken;
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const user = await User.findOne({accessToken: token});
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

module.exports = verifyToken;