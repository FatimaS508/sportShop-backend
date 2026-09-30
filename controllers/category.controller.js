const Category= require("../models/Category")

async function createCategory(req, res) {
    try {
        const { name, description } = req.body
        if (!name) {
            return res.status(400).json({
                message: "Category name is required."
            });
        }

        const category = await Category.create({ name, description })

        res.status(201).json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Category already exists."
            });
        }
    }
}

async function getCategories(req,res){
    try{
        const categories= await Category.find()
        return res.status(200).json(categories)
    }catch(err){console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getCategoryById(req, res) {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json(category)
    } catch (err) {
        console.log(err)

        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function updateCategory(req,res){
    try{
       const category= await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
       return res.status(201).json(category)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function deleteCategory(req, res) {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
            category
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports={createCategory, getCategories, getCategoryById, updateCategory, deleteCategory}