const auth = require("../controllers/healthCategoryController");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post("/api/v1/healthCategory/createCategory", authJwt.verifyToken, auth.createCategory);
        app.get("/api/v1/healthCategory/category/:id", auth.getIdCategory);
        app.patch("/api/v1/healthCategory/udateCategory/:id", authJwt.verifyToken, auth.updateCategory);
        app.get("/api/v1/healthCategory/category", auth.getCategory);
        app.delete("/api/v1/healthCategory/category/:id", authJwt.verifyToken, auth.deleteCategory);
}