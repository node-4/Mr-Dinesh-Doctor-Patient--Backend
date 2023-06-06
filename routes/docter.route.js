const auth = require("../controllers/doctorController");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
router.post('/loginWithPhone',auth.loginWithPhone);
router.post('/registrationFirst/:id',auth.registrationFirst);
router.post("/:id", auth.verifyOtp);
router.put("/update", [authJwt.verifyToken], auth.update);
router.put("/forgotPassword", auth.forgotPassword);
router.post("/forgotPasswordOtp/:id", auth.forgotPasswordOtp);
router.post("/resetPassword/:id", auth.resetPassword);
router.post("/resendotp/:id", auth.resendOTP);
router.put("/changePassword", [authJwt.verifyToken], auth.changePassword);
module.exports = router;