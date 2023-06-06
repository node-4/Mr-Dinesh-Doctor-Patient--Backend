const router = require('express').Router();
const chatController = require("../Controllers/chatController");
const authJwt = require("../middlewares/authJwt");


router.post('/userChat', authJwt.verifyToken, chatController.userChat);
router.get('/viewChat', authJwt.verifyToken, chatController.viewChat);
router.get('/chattingHistory', authJwt.verifyToken, chatController.chattingHistory);
router.delete('/deleteChat', authJwt.verifyToken, chatController.deleteChat);
router.put('/clearChat', authJwt.verifyToken, chatController.clearChat);
router.put('/deleteAllChat', authJwt.verifyToken, chatController.deleteAllChat);
module.exports = router;   
