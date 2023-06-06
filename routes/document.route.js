const auth = require("../controllers/documentController");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
router.post('/createDocument/:id',auth.createDocument);
router.get('/getDocument',authJwt.verifyToken,auth.getDocument);
router.put('/update/:id',authJwt.verifyToken,auth.updateDocument);
router.get('/getbyId/:id',authJwt.verifyToken,auth.getDocumentbyId);
router.delete('/deletebyId/:id',authJwt.verifyToken,auth.deleteDocument);
module.exports = router;