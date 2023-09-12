const auth = require("../controllers/paitents.Controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post("/api/v1/paitents/registration", auth.registration);
        app.post("/api/v1/paitents/loginWithPhone", auth.loginWithPhone);
        app.post("/api/v1/paitents/:id", auth.verifyOtp);
        app.put("/api/v1/paitents/forgotPassword", auth.forgotPassword);
        app.post("/api/v1/paitents/forgotPasswordOtp/:id", auth.forgotPasswordOtp);
        app.post("/api/v1/paitents/resetPassword/:id", auth.resetPassword);
        app.post("/api/v1/paitents/resendotp/:id", auth.resendOTP);
        app.put("/api/v1/paitents/update", [authJwt.verifyToken], auth.update);
        app.put("/api/v1/paitents/changePassword", [authJwt.verifyToken], auth.changePassword);
        app.post("/api/v1/paitents/help/createQuery", authJwt.verifyToken, auth.AddQuery);
        app.get("/api/v1/paitents/paginateDoctorSearch", authJwt.verifyToken, auth.paginateDoctorSearch);
}