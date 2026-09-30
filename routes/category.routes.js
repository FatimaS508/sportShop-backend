const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")

const categoryController= require("../controllers/category.controller")

router.post("/" , verifyToken, categoryController.createCategory)
router.get("/", categoryController.getCategories)
router.get("/:id", categoryController.getCategoryById)
router.put("/:id", verifyToken, categoryController.updateCategory)
router.delete("/:id", verifyToken, categoryController.deleteCategory)




module.exports= router