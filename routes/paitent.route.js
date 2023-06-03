const auth = require("../controllers/paitentsController");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.post("/registration", auth.registration);
    app.post("/loginWithPhone", auth.loginWithPhone);
    app.post("/:id", auth.verifyOtp);
    app.put("/forgotPassword", auth.forgotPassword);
    app.post("/forgotPasswordOtp/:id", auth.forgotPasswordOtp);
    app.post("/resetPassword/:id", auth.resetPassword);
    app.post("/resendotp/:id", auth.resendOTP);
    app.put("/update", [authJwt.verifyToken], auth.update);
    app.put("/changePassword", [authJwt.verifyToken], auth.changePassword);
};
