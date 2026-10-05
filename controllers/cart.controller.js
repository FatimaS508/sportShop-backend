const Cart = require("../models/Cart")
const Product= require("../models/Product")

async function addToCart(req, res) {
    try {
        
        const { productId, quantity, variantId } = req.body
        const userId = req.user._id
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const variant = product.variants.id(variantId)

        if (!variant) {
            return res.status(404).json({
                message: "Variant not found"
            })
        }
        if (quantity > variant.stockQuantity) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            })
        }

        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = await Cart.create({
                userId,
                item: [
                    {
                        productId,
                        quantity,
                        variantId
                    }
                ]
            })

            return res.status(201).json(cart)
        }
        const existingItem= cart.item.find(
            item=> item.variantId.toString() === variantId
        )
       
        if(existingItem){
            existingItem.quantity+= quantity
        }else{
            cart.item.push({productId,quantity,variantId})
        }
        

        await cart.save()
        
        return res.status(200).json(cart);

    } catch (err) {
        console.log(err)
        return res.status(500).json({
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

async function updateCartItem(req,res){
    try{
        const userId= req.user._id
        const {itemId} = req.params
        const cart= await Cart.findOne({userId})
        if(!cart){
            return res.status(404).json({message: "There is no cart"})
        }

        const item= cart.item.id(itemId)
        if(!item){
            res.status(404).json({message: "there is no item in the card"})
        }
        const {quantity}= req.body
        item.quantity = quantity
        await cart.save()
        return res.status(200).json(cart)

    }catch(err){
        console.log(err)
    }
}

async function removeCartItem(req, res) {
    try {
        const userId = req.user._id
        const { itemId } = req.params
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).json({ message: "There is no Cart" })
        }
        const item = cart.item.id(itemId)
        if (!item) {
            return res.status(404).json({ message: "there is no item in the card" })
        }
        item.deleteOne()
        await cart.save()
        return res.status(200).json(cart)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function clearCart(req, res) {
    try {
        const userId = req.user._id
        
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            res.status(404).json({ message: "There is no Cart" })
        }
        cart.item = [];
        await cart.save();
        return res.status(200).json({ message: "Cart cleared successfully" }, cart)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports={addToCart, getCart, updateCartItem, removeCartItem, clearCart}