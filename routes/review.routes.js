const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")

const reviewController= require("../controllers/review.controller")

router.post( "/products/:productId/reviews", verifyToken, reviewController.createReview)
router.get("/products/:productId/reviews",reviewController.getProductReviews)

router.put("/reviews/:id",verifyToken,reviewController.updateReview)

router.delete("/reviews/:id",verifyToken, reviewController.deleteReview)

module.exports= router