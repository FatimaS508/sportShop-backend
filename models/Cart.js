const mongoose= require("mongoose")

const CartSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    item:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },
        variantId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }]
}, {timestamps: true})

const Cart = mongoose.model("Cart", CartSchema)
module.exports= Cart