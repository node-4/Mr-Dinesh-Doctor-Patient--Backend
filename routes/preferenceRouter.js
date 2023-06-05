const router = require('express').Router();
const preferenceController = require("../Controllers/preferenceController");
const authJwt = require("../Middlewares/authJwt");

router.post('/addpreference',[authJwt.verifyToken], preferenceController.addpreference);
router.get('/getpreferencebytestid/:testID',[authJwt.verifyToken], preferenceController.getpreferencebytestid);
router.get('/getpreferencebyid/:id',[authJwt.verifyToken], preferenceController.getpreferencebyid);
router.get('/getallpreference',[authJwt.verifyToken], preferenceController.getallpreference);
router.delete('/deletepreference/:id',[authJwt.verifyToken], preferenceController.deletepreference);
router.put('/editpreference/:id',[authJwt.verifyToken], preferenceController.editpreference);
module.exports = router;
