const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")
const isAdmin= require("../middleware/isAdmin")

const orderController= require("../controllers/order.controller")

router.post("/", verifyToken, orderController.createOrder)
router.get("/", verifyToken, orderController.getOrders)

router.get("/admin", verifyToken, isAdmin, orderController.getAllOrders)
router.get("/:id", verifyToken, orderController.getOrderById)
router.put("/:id/status", verifyToken, isAdmin, orderController.updateOrderStatus)
router.put("/:id/payment-status", verifyToken, isAdmin, orderController.updatePaymentStatus)
router.put("/:id/cancel", verifyToken, orderController.cancelOrder)

module.exports= router