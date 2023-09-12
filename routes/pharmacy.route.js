const auth = require("../controllers/pharmacy.Controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post("/api/v1/pharmacy/registration", auth.registration);
        app.post("/api/v1/pharmacy/signIn", auth.signIn);
        app.post("/api/v1/pharmacy/loginWithPhone", auth.loginWithPhone);
        app.post("/api/v1/pharmacy/:id", auth.verifyOtp);
        app.put("/api/v1/pharmacy/forgotPassword", auth.forgotPassword);
        app.post("/api/v1/pharmacy/forgotPasswordOtp/:id", auth.forgotPasswordOtp);
        app.post("/api/v1/pharmacy/resetPassword/:id", auth.resetPassword);
        app.post("/api/v1/pharmacy/resendotp/:id", auth.resendOTP);
        app.put("/api/v1/pharmacy/update", [authJwt.verifyToken], auth.update);
        app.put("/api/v1/pharmacy/changePassword", [authJwt.verifyToken], auth.changePassword);
        app.post("/api/v1/pharmacy/help/createQuery", authJwt.verifyToken, auth.AddQuery);
        app.post("/api/v1/pharmacy/Category/createCategory", authJwt.verifyToken, auth.createCategory);
        app.get("/api/v1/pharmacy/Category/category/:id", auth.getIdCategory);
        app.patch("/api/v1/pharmacy/Category/udateCategory/:id", authJwt.verifyToken, auth.updateCategory);
        app.get("/api/v1/pharmacy/Category/category", authJwt.verifyToken, auth.getCategory);
        app.delete("/api/v1/pharmacy/Category/category/:id", authJwt.verifyToken, auth.deleteCategory);
        app.get("/api/v1/pharmacy/Sub/subcategory/:id", auth.getIdSubCategory);
        app.get("/api/v1/pharmacy/Sub/subcategory", authJwt.verifyToken, auth.getSubCategory);
        app.post("/api/v1/pharmacy/Sub/createSubcategory", authJwt.verifyToken, auth.createSubCategory);
        app.patch("/api/v1/pharmacy/Sub/subcategory/:id", authJwt.verifyToken, auth.updateSubCategory);
        app.delete("/api/v1/pharmacy/Sub/subcategory/:id", authJwt.verifyToken, auth.deleteSubCategory)
        app.get("/api/v1/Med/medicine/:id", auth.getIdMedicine);
        app.get("/api/v1/Med/medicine", authJwt.verifyToken, auth.getMedicine);
        app.post("/api/v1/Med/createMedicine", authJwt.verifyToken, auth.createMedicine);
        app.patch("/api/v1/Med/medicine/:id", authJwt.verifyToken, auth.updateMedicine);
        app.delete("/api/v1/Med/medicine/:id", authJwt.verifyToken, auth.deleteMedicine);
}