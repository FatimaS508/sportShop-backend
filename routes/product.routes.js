const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")
const isAdmin = require("../middleware/isAdmin")

const productsController= require("../controllers/product.controller")

router.post("/",isAdmin, productsController.createProduct)
router.get("/", productsController.getAllProducts)
router.get("/:id", productsController.getProductById)
router.put("/:id",verifyToken,isAdmin, productsController.updateProduct)
router.delete("/:id",verifyToken,isAdmin, productsController.deleteProduct)


module.exports= router