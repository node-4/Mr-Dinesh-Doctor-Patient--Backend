const router = require('express').Router();
const bookingController = require("../controllers/bookingController");
const authJwt = require("../middlewares/authJwt");
module.exports = (app) => {
        app.post('/api/v1/booking/addBook', [authJwt.verifyToken], bookingController.addBook);
        app.get('/api/v1/booking/getBookingbypreferenceid/:preferenceID', [authJwt.verifyToken], bookingController.getBookingbypreferenceid);
        app.get('/api/v1/booking/getbookingbyid/:id', [authJwt.verifyToken], bookingController.getbookingbyid);
        app.get('/api/v1/booking/getallBooking', [authJwt.verifyToken], bookingController.getallBooking);
        app.get('/api/v1/booking/getBookingbyuserid/me', [authJwt.verifyToken], bookingController.getBookingbyuserid);
        app.get('/api/v1/booking/getbookingbystatus', [authJwt.verifyToken], bookingController.getbookingbystatus);
        app.delete('/api/v1/booking/deleteBooking/:id', [authJwt.verifyToken], bookingController.deleteBooking);
        app.put('/api/v1/booking/editbooking/:id', [authJwt.verifyToken], bookingController.editbooking);
        app.patch('/api/v1/booking/cancelappointment/:id', [authJwt.verifyToken], bookingController.cancelappointment);
        app.patch('/api/v1/booking/completedappointment/:id', [authJwt.verifyToken], bookingController.completedappointment);
}