const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Address = require("../models/address.Model");
const helpandSupport = require("../models/helpandsupport.Model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
exports.loginWithPhone = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone: phone, role: "patient" });
        if (!user) {
            const userObj = {};
            req.body.otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            req.body.phone = phone;
            req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
            req.body.accountVerification = false;
            req.body.role = "patient";
            const userCreate = await User.create(req.body);
            return res.status(200).send({ userId: userCreate._id, otp: userCreate.otp });
        } else {
            const userObj = {};
            userObj.otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
            userObj.accountVerification = false;
            const updated = await User.findOneAndUpdate(
                { phone: phone, role: "patient" },
                userObj,
                { new: true }
            );
            return res.status(200).send({ userId: updated._id, otp: updated.otp });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        let user1 = await User.findOne({ phone: phone, role: "patient", });
        if (user1) {
            req.body.email = email.split(" ").join("").toLowerCase();
            let user = await User.findOne({ _id: { $ne: user1._id }, $and: [{ $or: [{ email: req.body.email }] }], role: "patient", });
            if (!user) {
                if (req.body.password == req.body.confirmPassword) {
                    req.body.password = bcrypt.hashSync(req.body.password, 8);
                    req.body.role = "patient";
                    req.body.completeProfile0 = true;
                    const userCreate = await User.findByIdAndUpdate({ _id: user1._id }, { $set: req.body }, { new: true });
                    return res.status(200).send({
                        message: "registered successfully ",
                        data: userCreate,
                    });
                } else {
                    return res.status(501).send({
                        status: 501,
                        message: "Password Not matched.",
                        data: {},
                    });
                }
            } else {
                return res.status(409).send({ message: "Email Alrady Exist", data: [] });
            }
        } else {
            return res.status(400).send({ msg: "not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const updated = await User.findByIdAndUpdate(
            { _id: user._id },
            { accountVerification: true },
            { new: true }
        );
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        return res.status(200).send({
            message: "logged in successfully",
            accessToken: accessToken,
            phone: user.phone
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: "internal server error" + err.message });
    }
};
exports.update = async (req, res) => {
    try {
        const { firstName, lastName, email, age, weight, height } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.fullName = user.fullName;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.age = age || user.age;
        user.weight = weight || user.weight;
        user.height = height || user.height;
        user.password = user.password;
        user.phone = user.phone;
        const updated = await user.save();
        return res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(404)
                .send({ message: "user not found ! not registered" });
        } else {
            const otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            const user1 = await User.findByIdAndUpdate(
                { _id: user._id },
                {
                    otp: otp,
                    accountVerification: false,
                    otpExpiration: Date.now() + 3600000,
                },
                { new: true }
            );
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "frieda.smitham40@ethereal.email",
                    pass: "TURy68KCpFSsFyNfjs",
                },
            });
            // Define the email options
            const mailOptions = {
                to: req.body.email,
                from: "node2@flyweis.technology",
                subject: "Password reset request",
                text:
                    `OTP ${otp}\n` +
                    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `your otp is ${otp} ` +
                    `for reset password\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            // Send the email with nodemailer
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        message:
                            "Could not send email. Please try again later.",
                    });
                }
                return res.status(200).json({
                    message: "Password reset email sent successfully",
                    otp: otp,
                    userId: user._id,
                });
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.forgotPasswordOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const updated = await User.findByIdAndUpdate(
            { _id: user._id },
            { accountVerification: true },
            { new: true }
        );
        return res.status(200).send({
            message: "otp verified successfull update your passpword.",
            userId: updated._id,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: "internal server error" + err.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        // Extract password and confirm password from request body
        const { password, confirmPassword } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            if (user.accountVerification == true) {
                if (password !== confirmPassword) {
                    return res.status(400).json({
                        status: 400,
                        message: "Passwords do not match",
                    });
                } else {
                    user.password = bcrypt.hashSync(password, 10);
                    await user.save();
                    return res.status(200).json({
                        status: 200,
                        message: "Password reset successful",
                    });
                }
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Please first verify your account.",
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.resendOTP = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const otp = newOTP.generate(4, {
            alphabets: false,
            upperCase: false,
            specialChar: false,
        });
        const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        const accountVerification = false;
        const updated = await User.findOneAndUpdate(
            { _id: id },
            { otp, otpExpiration, accountVerification },
            { new: true }
        );
        return res.status(200).send({ message: "OTP resent", otp: otp });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" + error.message });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            if (password !== confirmPassword) {
                return res.status(400).json({ status: 400, message: "Passwords do not match", });
            } else {
                user.password = bcrypt.hashSync(password, 10);
                await user.save();
                return res.status(200).json({ status: 200, message: "Password Changed successful" });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.AddQuery = async (req, res) => {
    try {
        req.body.user = req.user._id;
        const Data = await helpandSupport.create(req.body);
        return res.status(200).json({
            message: Data,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message, });
    }
};
exports.paginateDoctorSearch = async (req, res) => {
    try {
        const { search, fromDate, toDate, doctorCategoryId, page, limit } = req.query;
        let query = { role: "doctor" };
        if (search) {
            query.$or = [
                { "fullName": { $regex: req.query.search, $options: "i" }, },
                { "firstName": { $regex: req.query.search, $options: "i" }, },
            ]
        }
        if (doctorCategoryId) {
            query.doctorCategoryId = doctorCategoryId
        }
        if (fromDate && !toDate) {
            query.createdAt = { $gte: fromDate };
        }
        if (!fromDate && toDate) {
            query.createdAt = { $lte: toDate };
        }
        if (fromDate && toDate) {
            query.$and = [
                { createdAt: { $gte: fromDate } },
                { createdAt: { $lte: toDate } },
            ]
        }
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 15,
            sort: { createdAt: -1 },
            populate: ('doctorCategoryId')
        };
        let data = await User.paginate(query, options);
        return res.status(200).json({ status: 200, message: "doctor data found.", data: data });

    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};