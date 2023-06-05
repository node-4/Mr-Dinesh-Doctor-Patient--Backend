const router = require('express').Router();
const auth = require("../controllers/testhealthController");
const authJwt = require("../Middlewares/authJwt");

router.post('/addhealthtest',[authJwt.verifyToken], auth.addhealthtest);
router.get('/gethealthtestbyheathcategoryid/:healthtestcategoryid',[authJwt.verifyToken], auth.gethealthtestbyheathcategoryid);
router.get('/gethealthtestbyid/:id',[authJwt.verifyToken], auth.gethealthtestbyid);
router.get('/getallhealthtest',[authJwt.verifyToken], auth.getallhealthtest);
router.get('/getallhealthtestbystatus',[authJwt.verifyToken], auth.getallhealthtestbystatus);
router.delete('/deletetesthealth/:id',[authJwt.verifyToken], auth.deletetesthealth);
router.put('/editTestProduct/:id',[authJwt.verifyToken], auth.editTestProduct);
router.patch('/updatestate/:id',[authJwt.verifyToken], auth.updatestate);
module.exports = router;
