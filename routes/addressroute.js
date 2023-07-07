const authJwt = require("../middlewares/authJwt");
const auth = require("../controllers/addresscontroller");
module.exports = (app) => {
        app.post('/api/v1/address/createAddress', authJwt.verifyToken, auth.createAddress);
        app.get('/api/v1/address/getAddress', authJwt.verifyToken, auth.getAddress);
        app.put('/api/v1/address/update/:id', authJwt.verifyToken, auth.updateAddress);
        app.get('/api/v1/address/getbyId/:id', authJwt.verifyToken, auth.getAddressbyId);
        app.delete('/api/v1/address/deletebyId/:id', authJwt.verifyToken, auth.deleteAddress);
};