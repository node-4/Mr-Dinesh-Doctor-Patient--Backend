const router = require('express').Router();
const chatController = require("../controllers/chat.Controller");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
        app.post('/api/v1/chat/userChat', authJwt.verifyToken, chatController.userChat);
        app.get('/api/v1/chat/viewChat', authJwt.verifyToken, chatController.viewChat);
        app.get('/api/v1/chat/chattingHistory', authJwt.verifyToken, chatController.chattingHistory);
        app.delete('/api/v1/chat/deleteChat', authJwt.verifyToken, chatController.deleteChat);
        app.put('/api/v1/chat/clearChat', authJwt.verifyToken, chatController.clearChat);
        app.put('/api/v1/chat/deleteAllChat', authJwt.verifyToken, chatController.deleteAllChat);
};