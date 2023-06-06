const productController = require("../controllers/product.controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
router.post("/createProduct",[authJwt.verifyToken],productController.createProduct);
router.get("/admin/:id", productController.getIdProduct);
router.patch("/updateProduct/:id",[authJwt.verifyToken],productController.updateProduct);
router.get("/Allproduct", productController.getProduct);
router.delete("/deleteProduct/:id",[authJwt.verifyToken],productController.deleteProduct);
module.exports = router;
