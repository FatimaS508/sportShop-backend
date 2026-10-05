const Cart = require("../models/Cart")
const Order= require("../models/Order")
const Product = require("../models/Product")
const mongoose = require("mongoose")

async function createOrder(req,res){
    try{
        const userId= req.user._id
        const {shippingAddress, paymentMethod}= req.body
        const cart= await Cart.findOne({userId})
        if(!cart){
            return res.status(404).json({message: "There is no Cart"})
        }
        if (cart.item.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            })
        }
        let totalAmount = 0
        const orderItems = []
        for (const cartItem of cart.item) {
            const product = await Product.findById(cartItem.productId)
            if (!product) {
                return res.status(404).json({
                    message: "Product not found" })}
            const variant = product.variants.id(cartItem.variantId)
            if (!variant) {
                return res.status(404).json({ message: "Variant not found"})
            }
            if (cartItem.quantity > variant.stockQuantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                })
            }
            orderItems.push({
                productId: cartItem.productId,
                variantId: cartItem.variantId,
                productName: product.name,
                quantity: cartItem.quantity,
                unitPrice: variant.price,
                size: variant.size,
                color: variant.color
            })
            totalAmount += variant.price * cartItem.quantity 
        }
        //const orderNumber = new mongoose.Types.ObjectId().toString()
        for (const cartItem of cart.item) {
            const product = await Product.findById(cartItem.productId)
            const variant = product.variants.id(cartItem.variantId)

            variant.stockQuantity -= cartItem.quantity

            await product.save()
        }
        const order = await Order.create({
            userId,
            items: orderItems,
            //orderNumber,
            totalAmount,
            shippingAddress,
            paymentMethod
        })
        cart.item = []
        await cart.save()
        return res.status(201).json(order)
        


    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getOrders(req, res) {
    try {
        const userId = req.user._id

        const orders = await Order.find({ userId }).sort({ createdAt: -1 })

        if (orders.length === 0) {
            return res.status(404).json({
                message: "There are no orders"
            })
        }

        return res.status(200).json(orders)

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
async function getAllOrders(req, res) {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })

        return res.status(200).json(orders)

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getOrderById(req, res) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const order = await Order.findOne({
            _id: id,
            userId
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        return res.status(200).json(order)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params
        const { status } = req.body

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ]

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            })
        }

        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        order.currentStatus = status

        order.statusHistory.push({
            status,
            date: new Date()
        })

        await order.save()

        return res.status(200).json(order)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function updatePaymentStatus(req, res) {
    try {
        const { id } = req.params
        const { paymentStatus } = req.body

        const validPaymentStatuses = [
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ]

        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid payment status"
            })
        }

        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        order.paymentStatus = paymentStatus

        await order.save()

        return res.status(200).json(order)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function cancelOrder(req, res) {
    try {
        const userId = req.user._id
        const { id } = req.params

        const order = await Order.findOne({
            _id: id,
            userId
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.currentStatus === "Delivered") {
            return res.status(400).json({
                message: "Delivered orders cannot be cancelled"
            })
        }

        if (order.currentStatus === "Cancelled") {
            return res.status(400).json({
                message: "Order is already cancelled"
            })
        }

        for (const orderItem of order.items) {
            const product = await Product.findById(orderItem.productId)

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }

            const variant = product.variants.id(orderItem.variantId)

            if (!variant) {
                return res.status(404).json({
                    message: "Variant not found"
                })
            }

            variant.stockQuantity += orderItem.quantity

            await product.save()
        }

        order.currentStatus = "Cancelled"

        order.statusHistory.push({
            status: "Cancelled",
            date: new Date()
        })

        await order.save()

        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



module.exports= {createOrder, getOrders, getAllOrders, getOrderById, updateOrderStatus, updatePaymentStatus, cancelOrder}