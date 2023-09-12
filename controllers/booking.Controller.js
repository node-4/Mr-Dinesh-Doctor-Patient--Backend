const Testpreference = require("../models/testpreference.Model");
const Booking = require("../models/booking.Model");
const User = require("../models/user.model");

exports.addBook = async (req, res) => {
    try {
        const { doctorId, available, slot, dateOfVisit, reason } = req.body
        const contactid = await User.findById({ _id: doctorId });
        let obj = {
            userId: req.user.id,
            doctorId: doctorId,
            slot: slot,
            available: available,
            dateOfVisit: dateOfVisit,
            reason: reason,
            fee: contactid.fee
        }
        const data = await Booking.create(obj);
        res.status(200).json({ status: 200, data: data })
    } catch (error) {
        console.log(error)
        res.status(501).json({ status: 501, message: "Oops!!! Error Occurs" })
    }
}
exports.editbooking = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        const contactid = await User.findById({ _id: req.body.doctorId });
        const data = {
            userId: req.user.id || updateid.userId,
            doctorId: req.body.doctorId || updateid.doctorId,
            slot: req.body.slot || updateid.slot,
            available: req.body.available || updateid.available,
            dateOfVisit: dateOfVisit,
            reason: reason,
            fees: contactid.fee || updateid.fees,
        };
        let datas = await Booking.findByIdAndUpdate(req.params.id, data, { new: true })
        res.status(200).json({ message: "Booking updated successfuly", code: 200, data: datas })
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