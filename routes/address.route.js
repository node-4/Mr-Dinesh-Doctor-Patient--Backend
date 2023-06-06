const auth = require("../controllers/address.Controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
router.post('/createAddress', authJwt.verifyToken, auth.createAddress);
router.get('/getAddress', authJwt.verifyToken, auth.getAddress);
router.put('/update/:id', authJwt.verifyToken, auth.updateAddress);
router.get('/getbyId/:id', authJwt.verifyToken, auth.getAddressbyId);
router.delete('/deletebyId/:id', authJwt.verifyToken, auth.deleteAddress);
module.exports = router;