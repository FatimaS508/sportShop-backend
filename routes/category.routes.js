const router= require("express").Router()
const verifyToken= require("../middleware/verifyToken")
const isAdmin= require("../middleware/isAdmin")

const categoryController= require("../controllers/category.controller")

router.post("/" , verifyToken,isAdmin, categoryController.createCategory)
router.get("/", categoryController.getCategories)
router.get("/:id", categoryController.getCategoryById)
router.put("/:id", verifyToken,isAdmin, categoryController.updateCategory)
router.delete("/:id", verifyToken,isAdmin, categoryController.deleteCategory)


module.exports= router