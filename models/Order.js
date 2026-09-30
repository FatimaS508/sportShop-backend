const mongoose= require("mongoose")

const orderSchema= new mongoose.Schema({
    orderNumber:{
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         required: true
    },
    currentStatus:{
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    },
    totalAmount:{
        type: Number,
        required: true,
        min: 0
    },
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        variantId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productName:{
            type:String,
            required: true
        },
        quantity:{
            type:Number,
            required: true,
            min: 1
        },
        unitPrice:{
            type: Number,
            required: true,
            min: 0
        },
        size:{type: String},
        color:{type: String}
    }],
    shippingAddress:{
        fullname: {type: String, required: true},
        phone:{type: String, required: true},
        address:{type: String, required: true},
        city:{type: String, required: true},
        country:{type: String, required: true}
    },
    paymentMethod:{type: String,
        enum: ["Cash", "Card", "BenefitPay"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ],
        default: "Pending"
    },
    statusHistory: [
        {
            status: {
                type: String,
                required: true,
                enum: [
                    "Pending",
                    "Confirmed",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Cancelled"
                ]
            },

            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps: true})

const Order= mongoose.model("Order", orderSchema)
module.exports= Order