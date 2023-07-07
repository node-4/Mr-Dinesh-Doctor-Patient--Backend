const Testpreference = require("../models/testpreference.Model");
const Booking = require("../models/bookingModel");

exports.addBook = async (req, res) => {
    try {
        const { Patientname, dob, mobile, email, streetno, zipno, landmark, lng, lat, city, state, slot, available, preferenceID, userId, fees, doctorId } = req.body
        if (Patientname == '' || dob == '' || mobile == '' || email == '' || streetno == '' || zipno == '' || landmark == '' || lng == '' || lat == '' || city == '' || state == '' || slot == '' || available == '' || preferenceID == '' || userId == '' || fees == '' || doctorId == '') {
            res.status(201).json({ status: "Failed", message: "Empty Field Not Accepted" })
        } else {
            const check = await Booking.findOne({ preferenceID })
            if (check) {
                res.status(409).json({ status: "Failed", message: "You have appintment already for this test" })
            } else {
                const idcheck = await Testpreference.findOne({ _id: req.body.preferenceID })
                const data = await new Booking({
                    Patientname: req.body.Patientname,
                    dob: req.body.dob,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    streetno: req.body.streetno,
                    zipno: req.body.zipno,
                    landmark: req.body.landmark,
                    lng: req.body.lng,
                    lat: req.body.lat,
                    city: req.body.city,
                    state: req.body.state,
                    slot: req.body.slot,
                    available: req.body.available,
                    preferenceID: req.body.preferenceID,
                    doctorId: req.body.doctorId,
                    userId: req.user.id,
                    fees: idcheck.preferenceprice
                })
                await data.save()
                res.status(200).json({ status: 200, data: data })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
}
exports.editbooking = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        const { preferenceID } = req.body
        const idcheck = await Testpreference.findOne({ _id: preferenceID })
        if (updateid) {
            const data = {
                Patientname: req.body.Patientname || updateid.Patientname,
                dob: req.body.dob || updateid.dob,
                mobile: req.body.mobile || updateid.mobile,
                email: req.body.email || updateid.email,
                streetno: req.body.streetno || updateid.streetno,
                zipno: req.body.zipno || updateid.zipno,
                landmark: req.body.landmark || updateid.landmark,
                lng: req.body.lng || updateid.lng,
                lat: req.body.lat || updateid.lat,
                city: req.body.city || updateid.city,
                state: req.body.state || updateid.state,
                slot: req.body.slot || updateid.slot,
                available: req.body.available || updateid.available,
                preferenceID: req.body.preferenceID || updateid.preferenceID,
                doctorId: req.body.doctorId || updateid.doctorId,
                userId: req.user.id || updateid.userId,
                fees: idcheck.preferenceprice || updateid.fees,
            };
            let datas = await Booking.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(200).json({ message: "Booking updated successfuly", code: 200, data: datas })
        } else {
            res.status(404).json({ code: 404, status: "failed", message: "Invalid Booking ID", })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
exports.deleteBooking = async (req, res) => {
    try {
        const bookingid = await Booking.findByIdAndDelete(req.params.id)
        if (bookingid) {
            res.status(200).json({ message: "Booking Deleted Successfully" })
        } else {
            res.status(404).json({ message: "Invalid Booking ID" })
        }

    } catch (err) {
        res.status(501).json({ error: "Something Went Wrong" })
    }
};
exports.getbookingbyid = async (req, res) => {
    try {
        const singleBooking = await Booking.findById(req.params.id).populate("preferenceID").populate("doctorId").populate("userId")
        if (singleBooking) {
            res.status(200).json({ status: 200, message: "success", data: singleBooking })
        } else {
            res.status(404).json({
                status: 404, message: "Invalid Booking ID"
            })
        }
    } catch (error) {
        res.status(501).json(error)
    }
}
exports.getBookingbypreferenceid = async (req, res) => {
    try {
        const singlebooking = await Booking.find({ preferenceID: req.params.preferenceID }).populate("preferenceID").populate("doctorId").populate("userId")
        if (singlebooking.length > 0) {
            res.status(200).json({ status: 200, message: "success", data: singlebooking })
        } else {
            res.status(404).json({ status: 404, message: "Invalid Booking ID" })
        }


    } catch (error) {
        res.status(501).json(error)
    }
}
exports.getBookingbyuserid = async (req, res) => {
    const ids = req.user.id
    //const params=req.params.id
    try {
        const singlebooking = await Booking.find({ userId: ids })
            .populate("preferenceID")
            .populate("doctorId")
            .populate("userId")
        if (singlebooking) {
            res.status(200).json({ status: 200, message: "success", data: singlebooking })
        } else {
            res.status(404).json({ status: 404, message: "Invalid Booking ID" })
        }


    } catch (error) {
        res.status(501).json(error)
    }
}
exports.getallBooking = async (req, res) => {
    try {
        const data = await Booking.find().populate({ path: "preferenceID" }).populate({ path: "doctorId" }).populate({ path: "userId" })
        res.status(200).json({ status: 200, message: "success", count: data.length, data: data });

    } catch (error) {
        res.status(500).json(error)
    }
}
exports.getbookingbystatus = async (req, res, next) => {
    const statusSearch = req.query.status
    try {
        const data = await Booking.find({
            status: { $regex: `^${statusSearch}`, $options: 'i' }
        })
            .populate({ path: "preferenceID" })
            .populate({ path: "doctorId" })
            .populate({ path: "userId" })
        res.status(200).json({ data });
    } catch (e) {
        console.log(e)
        res.status(501).end()
    }
}
exports.cancelappointment = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        if (updateid) {
            const data = {
                status: "Cancelled",
            }
            datas = await Booking.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(200).json({
                message: "Appointment Cancelled", code: 200, data: datas
            })
        } else {
            res.status(404).json({
                code: 404, status: "failed", message: "Invalid Appointment ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
exports.completedappointment = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        if (updateid) {
            const data = { status: "Completed" }
            let datas = await Booking.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(200).json({ message: "Appointment Completed", code: 200, data: datas })
        } else {
            res.status(404).json({ code: 404, status: "failed", message: "Invalid Appointment ID", })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}