const User = require("../models/userModel");
const Address = require("../models/address.Model");
exports.createAddress = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            req.body.user = req.user.id;
            const address = await Address.create(req.body);
            res.status(201).json({ success: true, address });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            const allAddress = await Address.find({ user: user._id });
            if (allAddress.length == 0) {
                res.status(404).json({
                    status: 404,
                    message: "Data not found.",
                });
            } else {
                res.status(200).json({ status: 200, data: allAddress });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findAddress = await Address.findById({ _id: req.params.id });
            if (!findAddress) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                findAddress.address = req.body.address || findAddress.address;
                findAddress.city = req.body.city || findAddress.city;
                findAddress.state = req.body.state || findAddress.state;
                findAddress.pinCode = req.body.pinCode || findAddress.pinCode;
                findAddress.landMark = req.body.landMark || findAddress.landMark;
                findAddress.street = req.body.street || findAddress.street;
                findAddress.user = findAddress.user;
                const updated = await findAddress.save();
                res.status(200).send({ message: "updated", data: updated });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.getAddressbyId = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findAddress = await Address.findById({ _id: req.params.id });
            if (!findAddress) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                res.status(200).send({ message: "get Data", data: findAddress });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findAddress = await Address.findById({ _id: req.params.id });
            if (!findAddress) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                let deleteData = await Address.findByIdAndDelete({ _id: findAddress._id });
                res.status(200).json({ status: 200, message: "Data Delete.", });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};