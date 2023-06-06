const auth = require("../controllers/address.controller");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
app.post('/createAddress', authJwt.verifyToken, auth.createAddress);
app.get('/getAddress', authJwt.verifyToken, auth.getAddress);
app.put('/update/:id', authJwt.verifyToken, auth.updateAddress);
app.get('/getbyId/:id', authJwt.verifyToken, auth.getAddressbyId);
app.delete('/deletebyId/:id', authJwt.verifyToken, auth.deleteAddress);
};