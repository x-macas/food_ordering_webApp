const mongoose = require("mongoose");
const {Schema} = mongoose

const orderSchema = new Schema(
    {
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        order_data: {
            type: Array,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);