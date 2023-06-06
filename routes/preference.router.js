const router = require('express').Router();
const preferenceController = require("../controllers/preference.Controller");
const authJwt = require("../middlewares/authJwt");
module.exports = (app) => {
app.post('/api/v1/preferenceRouter/addpreference', preferenceController.addpreference);
app.get('/api/v1/preferenceRouter/getpreferencebytestid/:testID', preferenceController.getpreferencebytestid);
app.get('/api/v1/preferenceRouter/getpreferencebyid/:id', preferenceController.getpreferencebyid);
app.get('/api/v1/preferenceRouter/getallpreference', preferenceController.getallpreference);
app.delete('/api/v1/preferenceRouter/deletepreference/:id', preferenceController.deletepreference);
app.put('/api/v1/preferenceRouter/editpre/:ferenceid', preferenceController.editpreference);
}