const auth = require("../controllers/healthCategoryController");
const authJwt = require("../middlewares/authJwt");
const express = require("express");
const router = express();
router.post("/createCategory",authJwt.verifyToken,auth.createCategory);
router.get("/category/:id", auth.getIdCategory);
router.patch("/udateCategory/:id",authJwt.verifyToken,auth.updateCategory);
router.get("/category", auth.getCategory);
router.delete("/category/:id",authJwt.verifyToken, auth.deleteCategory);
module.exports = router;
