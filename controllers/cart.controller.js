const Cart = require("../models/Cart")

async function addToCart(req, res){
    try{
        const {productId, quantity,  variantId}= req.body
        const userId= req.user._id

        const cart= await Cart.create({userId ,productId, quantity,  variantId})
        res.status(201).json(cart)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

async function getCart(req, res) {
    try {
        
        const userId= req.user._id
        
        const cart= await Cart.findOne({userId})
        
        if(!cart){
            return res.status(404).json({message: "There is no cart"})
        }
        
        return res.status(200).json(cart)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Internal server Error"})
    }
}

module.exports={addToCart, getCart}