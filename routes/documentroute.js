const auth = require("../controllers/documentController");
const authJwt = require("../middlewares/authJwt");
const router = require('express').Router();
module.exports = (app) => {
        app.post('/api/v1/document/createDocument/:id', auth.createDocument);
        app.get('/api/v1/document/getDocument', authJwt.verifyToken, auth.getDocument);
        app.put('/api/v1/document/update/:id', authJwt.verifyToken, auth.updateDocument);
        app.get('/api/v1/document/getbyId/:id', authJwt.verifyToken, auth.getDocumentbyId);
        app.delete('/api/v1/document/deletebyId/:id', authJwt.verifyToken, auth.deleteDocument);
}