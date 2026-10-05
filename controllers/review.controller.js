const Review = require("../models/Review")
const Product = require("../models/Product")
const Order = require("../models/Order")

async function createReview(req, res) {
    try {
        const customerId = req.user._id
        const { productId } = req.params
        const { rating, comment } = req.body

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            })
        }

        const order = await Order.findOne({
            userId: customerId,
            "items.productId": productId
        })

        if (!order) {
            return res.status(403).json({
                message: "You can only review products you purchased"
            })
        }

        const existingReview = await Review.findOne({
            customerId,
            productId
        })

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            })
        }

        const review = await Review.create({
            customerId,
            productId,
            rating,
            comment
        })

        return res.status(201).json(review)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


async function getProductReviews(req, res) {
    try {
        const { productId } = req.params

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const reviews = await Review.find({ productId })
            .populate("customerId", "firstName lastName")
            .sort({ createdAt: -1 })

        return res.status(200).json(reviews)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


async function updateReview(req, res) {
    try {
        const customerId = req.user._id
        const { id } = req.params
        const { rating, comment } = req.body

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            })
        }

        const review = await Review.findOne({
            _id: id,
            customerId
        })

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            })
        }

        if (rating !== undefined) {
            review.rating = rating
        }

        if (comment !== undefined) {
            review.comment = comment
        }

        await review.save()

        return res.status(200).json(review)

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


async function deleteReview(req, res) {
    try {
        const customerId = req.user._id
        const { id } = req.params

        const review = await Review.findOne({
            _id: id,
            customerId
        })

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            })
        }

        await review.deleteOne()

        return res.status(200).json({
            message: "Review deleted successfully"
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports = {createReview, getProductReviews,updateReview,deleteReview}