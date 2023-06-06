const router = require('express').Router();
const auth = require("../Controllers/testhealthController");
const authJwt = require("../middlewares/authJwt");

router.post('/addhealthtest', auth.addhealthtest);
router.get('/gethealthtestbyheathcategoryid/:healthtestcategoryid', auth.gethealthtestbyheathcategoryid);
router.get('/gethealthtestbyid/:id', auth.gethealthtestbyid);
router.get('/getallhealthtest', auth.getallhealthtest);
router.get('/getallhealthtestbystatus', auth.getallhealthtestbystatus);
router.delete('/deletetesthealth/:id', auth.deletetesthealth);
router.put('/editTestProduct/:id', auth.editTestProduct);
router.patch('/updatestate/:id', auth.updatestate);
module.exports = router;
