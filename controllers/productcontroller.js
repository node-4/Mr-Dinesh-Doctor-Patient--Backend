const Category = require("../models/categorymodel");
const product = require("../models/productmodel");
const subCategory = require("../models/subcategory.model");
exports.createProduct = async (req, res) => {
    try {
        const data = await Category.findById(req.body.categoryId);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        const findSubCategory = await subCategory.findById(req.body.subcategoryId);
        if (!findSubCategory || findSubCategory.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        req.body.userId = req.user._id;
        req.body.categoryId = data._id;
        const productCreated = await product.create(req.body);
        console.log(`#### Product add successfully #### /n ${productCreated} `);
        res.status(201).send({
            message: "Product add successfully",
            data: productCreated,
        });
    } catch (err) {
        console.log("#### error while product create #### ", err.message);
        res.status(500).send({
            message: "Internal server error while creating product",
        });
    }
};
exports.getProduct = async (req, res) => {
    try {
        const data = await product.find().populate("categoryId subcategoryId userId");
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.getIdProduct = async (req, res) => {
    try {
        const data = await product.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        let saveProduct = await product.findById(req.params.id);
        if (!saveProduct) {
            return next(new ErrorHander("Product not found", 404));
        }
        let findProduct = await product.findByIdAndUpdate(
            saveProduct._id,
            {
                categoryId: req.body.categoryId || product.categoryId,
                subcategoryId: req.body.subcategoryId || product.subcategoryId,
                productImages: req.body.productImages || product.productImages,
                productName: req.body.productName || product.productName,
                description: req.body.description || product.description,
                price: req.body.price || product.price,
                discount: req.body.discount || product.discount,
                stock: req.body.stock || product.stock,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );
        res.status(200).send({ msg: "updated", data: findProduct });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const data = await product.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
};
