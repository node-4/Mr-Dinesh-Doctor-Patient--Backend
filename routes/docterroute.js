const auth = require("../controllers/doctorController");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post('/api/v1/docter/loginWithPhone', auth.loginWithPhone);
        app.post('/api/v1/docter/registrationFirst/:id', auth.registrationFirst);
        app.post("/api/v1/docter/:id", auth.verifyOtp);
        app.put("/api/v1/docter/update", [authJwt.verifyToken], auth.update);
        app.put("/api/v1/docter/forgotPassword", auth.forgotPassword);
        app.post("/api/v1/docter/forgotPasswordOtp/:id", auth.forgotPasswordOtp);
        app.post("/api/v1/docter/resetPassword/:id", auth.resetPassword);
        app.post("/api/v1/docter/resendotp/:id", auth.resendOTP);
        app.put("/api/v1/docter/changePassword", [authJwt.verifyToken], auth.changePassword);
}