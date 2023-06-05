const router = require('express').Router();
const preferenceController = require("../Controllers/preferenceController");
const authJwt = require("../Middlewares/authJwt");

router.post('/addpreference',[authJwt.verifyToken], preferenceController.addpreference);
router.get('/getpreferencebytestid/:testID',[authJwt.verifyToken], getpreferencebytestid);
router.get('/getpreferencebyid/:id',[authJwt.verifyToken], getpreferencebyid);
router.get('/getallpreference',[authJwt.verifyToken], getallpreference);
router.delete('/deletepreference/:id',[authJwt.verifyToken], deletepreference);
router.put('/editpreference/:id',[authJwt.verifyToken], editpreference);
module.exports = router;
