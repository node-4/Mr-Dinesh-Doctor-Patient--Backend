const productController = require("../controllers/product.controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post("/api/v1/product/createProduct", [authJwt.verifyToken], productController.createProduct);
        app.get("/api/v1/product/admin/:id", productController.getIdProduct);
        app.patch("/api/v1/product/updateProduct/:id", [authJwt.verifyToken], productController.updateProduct);
        app.get("/api/v1/product/Allproduct", productController.getProduct);
        app.delete("/api/v1/product/deleteProduct/:id", [authJwt.verifyToken], productController.deleteProduct);
}