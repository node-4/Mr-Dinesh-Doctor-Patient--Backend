const router = require('express').Router();
const auth = require("../controllers/testhealthController");
const authJwt = require("../middlewares/authJwt");
module.exports = (app) => {
        app.post('/api/v1/testhealth/addhealthtest', auth.addhealthtest);
        app.get('/api/v1/testhealth/gethealthtestbyheathcategoryid/:healthtestcategoryid', auth.gethealthtestbyheathcategoryid);
        app.get('/api/v1/testhealth/gethealthtestbyid/:id', auth.gethealthtestbyid);
        app.get('/api/v1/testhealth/getallhealthtest', auth.getallhealthtest);
        app.get('/api/v1/testhealth/getallhealthtestbystatus', auth.getallhealthtestbystatus);
        app.delete('/api/v1/testhealth/deletetesthealth/:id', auth.deletetesthealth);
        app.put('/api/v1/testhealth/editTestProduct/:id', auth.editTestProduct);
        app.patch('/api/v1/testhealth/updatestate/:id', auth.updatestate);
}