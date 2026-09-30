const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")

const productsController= require("../controllers/product.controller")

router.post("/", productsController.createProduct)
router.get("/", productsController.getAllProducts)
router.get("/:id", productsController.getProductById)
router.put("/:id",verifyToken, productsController.updateProduct)
router.delete("/:id",verifyToken, productsController.deleteProduct)


module.exports= router