const router = require('express').Router();
const preferenceController = require("../controllers/preference.Controller");
const authJwt = require("../middlewares/authJwt");

router.post('/addpreference', preferenceController.addpreference);
router.get('/getpreferencebytestid/:testID', preferenceController.getpreferencebytestid);
router.get('/getpreferencebyid/:id', preferenceController.getpreferencebyid);
router.get('/getallpreference', preferenceController.getallpreference);
router.delete('/deletepreference/:id', preferenceController.deletepreference);
router.put('/editpre/:ferenceid', preferenceController.editpreference);
module.exports = router;
