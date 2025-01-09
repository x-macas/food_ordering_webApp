const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const mongoose = require("mongoose");   
const {Schema} = mongoose

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true, 
        },
        googleId: {
            type: String, 
            unique: true,
            sparse: true
        },
        password: {
            type: String,
            // required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        location:{
            type: String,
            // required: true 
        },
        accessToken:{
            type: String,
        }
    },
    {
        timestamps: true
    }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// const User = 

module.exports = mongoose.model('User', userSchema);