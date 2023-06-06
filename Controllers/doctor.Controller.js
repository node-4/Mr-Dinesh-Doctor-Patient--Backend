const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Address = require("../models/address.Model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
exports.loginWithPhone = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone: phone, role: "doctor" });
        if (!user) {
            req.body.role = "doctor";
            req.body.otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
            req.body.accountVerification = false;
            const userCreate = await User.create(req.body);
            res.status(200).send({
                message: "registered successfully ",
                userId: userCreate._id,
                otp: userCreate.otp,
                complete: userCreate.completeProfile,
            });
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
                { phone: phone, role: "doctor" },
                userObj,
                { new: true }
            );
            res.status(200).send({
                userId: updated._id,
                otp: updated.otp,
                complete: updated.completeProfile,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.registrationFirst = async (req, res) => {
    try {
        const { fullName, dob, registrationNumber } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.fullName = fullName || user.fullName;
        user.dob = dob || user.dob;
        user.registrationNumber = registrationNumber || user.registrationNumber;
        const updated = await user.save();
        res.status(200).send({
            message: "updated",
            userId: updated._id,
            complete: updated.completeProfil,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "internal server error " + err.message,
        });
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
        res.status(200).send({
            message: "logged in successfully",
            accessToken: accessToken,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "internal server error" + err.message });
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
        res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        res.status(500).send({
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
                res.status(200).json({
                    message: "Password reset email sent successfully",
                    otp: otp,
                    userId: user._id,
                });
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
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
        res.status(200).send({
            message: "otp verified successfull update your passpword.",
            userId: updated._id,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "internal server error" + err.message });
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
                    res.status(200).json({
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
        res.status(500).json({
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
        res.status(200).send({ message: "OTP resent", otp: otp });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" + error.message });
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
                res.status(200).json({ status: 200, message: "Password Changed successful" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};