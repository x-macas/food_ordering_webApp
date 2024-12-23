const mongoose = require("mongoose");
const {Schema} = mongoose

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);