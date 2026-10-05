const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")
const cartController= require("../controllers/cart.controller")

router.post("/", verifyToken,cartController.addToCart)
router.get("/", verifyToken, cartController.getCart)
router.put("/items/:itemId", verifyToken, cartController.updateCartItem)
router.delete("/items/:itemId", verifyToken, cartController.removeCartItem)
router.delete("/clear", verifyToken, cartController.clearCart);

module.exports= router