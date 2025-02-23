const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const mongoose = require("mongoose");   
const {Schema} = mongoose

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
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
            required: function(){
                return this.authProvider === "local"; //only required password for local auth
            }
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            required: true
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