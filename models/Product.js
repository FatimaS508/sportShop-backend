const mongoose= require("mongoose")

const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true

    },
    description:{
        type: String,
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    material:{
        type: String
    },
    images: {
        type: [String],
        default: []
    },
    variants:[{
        variantCode: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        color:{
            type: String,
            required: true,
            trim: true
        },
        size:{
            type: String,
            required: true,
            trim: true
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        stockQuantity:{
            type: Number,
            required: true,
            min: 0
        }
    }],
},{timestamps: true})

const Product= mongoose.model("product", productSchema)
module.exports= Product