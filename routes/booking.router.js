const router = require('express').Router();
const bookingController = require("../controllers/bookingController");
const authJwt = require("../middlewares/authJwt");

router.post('/addBook', [authJwt.verifyToken], bookingController.addBook);
router.get('/getBookingbypreferenceid/:preferenceID', [authJwt.verifyToken], bookingController.getBookingbypreferenceid);
router.get('/getbookingbyid/:id', [authJwt.verifyToken], bookingController.getbookingbyid);
router.get('/getallBooking', [authJwt.verifyToken], bookingController.getallBooking);
router.get('/getBookingbyuserid/me', [authJwt.verifyToken], bookingController.getBookingbyuserid);
router.get('/getbookingbystatus', [authJwt.verifyToken], bookingController.getbookingbystatus);
router.delete('/deleteBooking/:id', [authJwt.verifyToken], bookingController.deleteBooking);
router.put('/editbooking/:id', [authJwt.verifyToken], bookingController.editbooking);
router.patch('/cancelappointment/:id', [authJwt.verifyToken], bookingController.cancelappointment);
router.patch('/completedappointment/:id', [authJwt.verifyToken], bookingController.completedappointment);
module.exports = router;
