const Product= require("../models/Product")
const Category = require("../models/Category");

async function createProduct(req, res) {
    try {
        const {
            name,
            description,
            categoryId,
            material,
            images,
            variants
        } = req.body;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        const product = await Product.create({
            name,
            description,
            categoryId,
            material,
            images,
            variants
        })
        res.status(201).json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getAllProducts(req, res) {
    try {
        const products = await Product.find()
        return res.status(200).json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getProductById(req,res){
    try{
        const product= await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({message: "Product not found"})
        }
        res.status(200).json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }
    }
}

async function updateProduct(req, res) {
    try {
        const { name,
            description,
            material,
            images,
            variants } = req.body
        const product = await Product.findByIdAndUpdate(req.params.id,
            {
                name,
                description,
                material,
                images,
                variants
            }, { new: true })
        if (!product) {
            res.status(404).json({ message: "Produc not found" })
        }
        res.status(200).json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function deleteProduct(req,res){
    try{
        const product= await Product.findByIdAndDelete(req.params.id)
        if(!product){
            res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({
            message: "Product deleted successfully",
            product
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports= {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct}